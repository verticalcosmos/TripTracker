# TripTracker

TripTracker is a travel application. It pulls data from multiple APIs based on the user's input information. The project includes a simple form where users enter the location they are traveling to and the date they are leaving. If the trip is within a week, users will get the current weather forecast. If the trip is in the future, they will get a predicted forecast.Additionally, the app displays an image of the location entered using the Pixabay API. Moreover, the application saves the data to the local memory for later retrieval. An autocomplete handler is used to give location suggestions to users as they input the name of the city.

# Running

NodeJS must be installed on your computer before running the app.

## Note
**IMPORTANT** **_The app uses external APIs, and for the app to work on your computer, you need the register and receive API keys from these APIs:._**

- [geonames](http://www.geonames.org/export/web-services.html)
- [weatherbit](https://www.weatherbit.io/account/create)
- [pixabay](https://pixabay.com/api/docs/)

1. Open the Terminal inside the project folder and run `npm install`.

2. `npm run build-prod` to build the dist folder.

3. Type in `npm start` and Ctrl+click on `localhost:8080` to initialize the app.

To run in development mode type `npm run build-dev`.

## Note
Clear History from your browser to clear all the trips from local memory.

# Use
The app is usable accross multiple screen sizes and modern browsers.

# Testing

Jest is used for testing.
Run `npm test` inside the project folder.

# Webpack
This project uses Webpack for bundling
