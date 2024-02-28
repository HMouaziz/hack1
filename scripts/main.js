import {MAPBOX_API_KEY, OPENAI_API_KEY} from './secrets.js';


mapboxgl.accessToken = MAPBOX_API_KEY;
const map = new mapboxgl.Map({
    container: 'map',
    projection: 'globe',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 1.5,
    center: [30, 50]
});

map.on('load', async () => {
    const loadImagePromise = new Promise((resolve, reject) => {
        map.loadImage('../assets/images/ISS-Icon.png', (error, image) => {
            if (error) reject(error);
            resolve(image);
        });
    });
    const loadImagePromise2 = new Promise((resolve, reject) => {
        map.loadImage('../assets/images/site-icon.png', (error, image) => {
            if (error) reject(error);
            resolve(image);
        });
    });

    async function setupMap() {
        try {
            const image = await loadImagePromise;
            const image2 = await loadImagePromise2;
            map.addImage('iss-marker', image);
            map.addImage('site-marker', image2);

            const geojson = await getISS();

            const geojsonSites = getSites();

            map.addSource('sites', {
                type: 'geojson',
                data: geojsonSites
            });

            map.addLayer({
                id: 'sites-layer',
                type: 'symbol',
                source: 'sites',
                layout: {
                    'icon-image': 'site-marker',
                    'icon-size': 0.5,
                    'icon-allow-overlap': true,
                    'text-field': ['get', 'name'],
                    'text-offset': [0, 1.5],
                    'text-anchor': 'top'
                }
            });

            //Add ISS Trailing Line
            const lineCoordinates = geojson.features[0].geometry.coordinates;

            map.addSource('iss-trail', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [lineCoordinates]
                    }
                }
            });

            map.addLayer({
                id: 'iss-trail',
                type: 'line',
                source: 'iss-trail',
                layout: {},
                paint: {
                    'line-width': [
                        'interpolate', ['linear'], ['zoom'],

                        0, 8,

                        22, 12
                    ],
                    'line-color': '#f15d02',
                    'line-dasharray': [5, 5]
                }
            });


            map.addSource('iss', {
                type: 'geojson',
                data: geojson
            });

            map.addLayer({
                'id': 'iss',
                'type': 'symbol',
                'source': 'iss',
                'layout': {
                    'icon-image': 'iss-marker',
                    'icon-size': 0.7
                }
            });

        } catch (error) {
            console.error('Error setting up map:', error);
        }
    }

    await setupMap();

});


map.on('click', 'iss', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});

map.on('mouseenter', 'iss', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'iss', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'sites-layer', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
});

map.on('mouseenter', 'sites-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'sites-layer', () => {
    map.getCanvas().style.cursor = '';
});



const updateSource = setInterval(async () => {
    const geojson = await getISS(updateSource);
    map.getSource('iss').setData(geojson);

    // Update the line trail
    const newLocation = geojson.features[0].geometry.coordinates;
    const lineSource = map.getSource('iss-trail');
    const data = lineSource._data;
    data.geometry.coordinates.push(newLocation);
    lineSource.setData(data);

}, 5000);


async function getISS(updateSource) {
    try {
        const response = await fetch(
            'https://api.wheretheiss.at/v1/satellites/25544',
            {method: 'GET'}
        );
        const {latitude, longitude} = await response.json();

        map.flyTo({
            center: [longitude, latitude],
            speed: 0.5
        });

        return {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [longitude, latitude]
                    },
                    'properties': {
                        'name': 'International Space Station',
                        'description': "The International Space Station (ISS) is a marvel of modern science and international collaboration, orbiting Earth every 90 minutes at 28,000 km/h. Launched in 1998, it unites space agencies from the US (NASA), Russia (Roscosmos), Europe (ESA), Japan (JAXA), and Canada (CSA) for research in microgravity, space science, and more. Continuously manned since November 2000, the ISS exemplifies humanity's joint pursuit of exploration and discovery."
                    }
                }
            ]
        }
            ;
    } catch (err) {
        if (updateSource) clearInterval(updateSource);
        throw new Error(err);
    }
}

const getSites = () => {
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-95.093, 29.5595]
                },
                "properties": {
                    "name": "Johnson Space Center",
                    "description": "NASA's primary center for human spaceflight training, research, and flight control in Houston, Texas. Manages all ISS operations."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-80.64898, 28.5721]
                },
                "properties": {
                    "name": "Kennedy Space Center",
                    "description": "A primary NASA launch site in Florida, used for launching spacecraft to the ISS, including the SpaceX Crew Dragon and previously the Space Shuttle."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [63.332, 45.965]
                },
                "properties": {
                    "name": "Baikonur Cosmodrome",
                    "description": "The world's first and largest operational space launch facility in Kazakhstan, leased by Russia for Soyuz and Progress spacecraft launches to the ISS."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-52.7689, 5.236]
                },
                "properties": {
                    "name": "Guiana Space Centre",
                    "description": "A European spaceport in French Guiana used by ESA for launching Ariane 5, Soyuz, and Vega rockets to the ISS."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [38.0833, 55.8800]
                },
                "properties": {
                    "name": "Yuri Gagarin Cosmonaut Training Center",
                    "description": "Located in Star City, Russia, this facility is used for training before going to the ISS."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [140.0369, 36.0825]
                },
                "properties": {
                    "name": "JAXA Tsukuba Space Center",
                    "description": "JAXA's research and development center in Tsukuba, Japan, for astronaut training and space mission control, including ISS missions."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [6.8836, 50.9175]
                },
                "properties": {
                    "name": "European Astronaut Centre",
                    "description": "ESA's astronaut training center in Cologne, Germany, where astronauts prepare for missions to the ISS."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-73.396, 45.517]
                },
                "properties": {
                    "name": "Canadian Space Agency Headquarters",
                    "description": "Located in Saint-Hubert, Quebec, Canada, important for training Canadian astronauts and contributing technology to the ISS."
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [37.6173, 55.7558]
                },
                "properties": {
                    "name": "Roscosmos State Corporation",
                    "description": "The governmental body responsible for the space science program in Russia, overseeing cosmonaut training and launches to the ISS."
                }
            }
        ]
    }
}
