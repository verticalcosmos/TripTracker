const fetch = require('node-fetch');


// Get data from APIs

const geonames = async (val, key) => {
  const options = `maxRows=5&fuzzy=1&username=${key}`;
  const response = await fetch(`http://api.geonames.org/searchJSON?q=&name_startsWith=${val}&${options}`);
  const data = await response.json();
  try {
    return data;
  } catch (error) {
    return error;
  }
};

const getImage = async (trip, key) => {
  const city = trip.city.toLowerCase();
  const apiKey = key;
  const options = 'image_type=photo&pretty=true&safesearch=true';
  const response = await fetch(`https://pixabay.com/api/?q=${city}+city&key=${apiKey}&${options}`);
  const result = await response.json();
  try {
    return result;
  } catch (error) {
    return error;
  }
};

const gethWeather = async (trip, days, key) => {
  const baseUrl = 'http://api.weatherbit.io/v2.0';
  const lat = trip.lattitude;
  const lon = trip.longitude;
   if (days <= 7) {
    const response = await fetch(`${baseUrl}/current?lat=${lat}&lon=${lon}&key=${key}`);
    const result = await response.json();
    try {
      return result;
    } catch (error) {
      return error;
    }
  } else {
    const response = await fetch(`${baseUrl}/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`);
    const result = await response.json();
    try {
      return result;
    } catch (error) {
      return error;
    }
  }
};

module.exports = {
  geonames,
  getImage,
  gethWeather,
};
