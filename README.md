# International Space Station (ISS) Tracker

Welcome to the ISS Tracker project! This repository contains a web application that provides real-time tracking of the International Space Station (ISS) on an interactive Mapbox map. The project was developed during a 6-hour hackathon.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The ISS Tracker application displays the current position of the ISS along with a trailing line indicating its recent path. Additionally, it marks significant space-related locations on the map, such as space agencies and launch sites, with detailed descriptions available on click.

## Features

- Real-time tracking of the ISS.
- Interactive map with ISS and significant site markers.
- Information pop-ups for the ISS and other marked locations.
- Map zoom and pan capabilities.
- Responsive design suitable for various devices.

## Installation

To run the ISS Tracker locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HMouaziz/iss-tracker.git
   cd iss-tracker
   ```

2. **Install dependencies:**
   Ensure you have a local server setup. You can use various methods such as:
   - **Using VS Code Live Server Plugin:**
     - Install the Live Server plugin from the VS Code marketplace.
     - Open the project folder in VS Code.
     - Right-click on the `index.html` file and select `Open with Live Server`.
   - **Using JetBrains IDE Built-in Server:**
     - Open the project in a JetBrains IDE like WebStorm or IntelliJ IDEA.
     - Right-click on the `index.html` file and select `Run 'index.html'`.
   - **Using Python's HTTP server:**
     ```bash
     python3 -m http.server
     ```

3. **Add your API keys:**
   Create a `secrets.js` file in the `scripts` directory with your Mapbox and OpenAI API keys.
   ```javascript
   export const MAPBOX_API_KEY = 'your_mapbox_api_key';
   export const OPENAI_API_KEY = 'your_openai_api_key';
   ```

4. **Run the server:**
   If you are using a local server, navigate to `http://localhost:8000` in your browser.

## Usage

Once the server is running, open your browser and navigate to `http://localhost:8000`. You will see the ISS Tracker application displaying the map with the ISS and various space-related locations.

### Interactions

- **ISS Marker:**
  - Click on the ISS marker to view its description.
  - The map will fly to the ISS's current location every 5 seconds.
- **Site Markers:**
  - Click on any site marker to view detailed information about the location.
  - Hover over markers to change the cursor style, indicating interactivity.

## Technologies

- **HTML/CSS:** For structuring and styling the web page.
- **JavaScript:** For handling the map functionality and API requests.
- **Mapbox GL JS:** For the interactive map and markers.
- **ISS API:** To fetch real-time data about the ISS's location.

## Project Structure

```plaintext
iss-tracker/
├── assets/
│   └── images/
│       ├── ISS-Icon.png
│       └── site-icon.png
├── scripts/
│   ├── main.js
│   └── secrets.js (you need to create this)
├── styles/
│   └── main.css
├── index.html
└── README.md
```

- `index.html`: Main HTML file containing the structure of the web application.
- `styles/main.css`: CSS file for styling the application.
- `scripts/main.js`: JavaScript file for handling the map logic and API requests.
- `scripts/secrets.js`: JavaScript file for storing API keys (not included in the repository).

## Contributing

We welcome contributions to improve the ISS Tracker! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a pull request.

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for more details.

---

Developed by Halim Mouaziz @ project-hephaestus.com &copy; 2024
