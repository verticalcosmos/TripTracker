//dotenv
const dotenv = require('dotenv');

dotenv.config();

// Express and Cors
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiCalls = require('./apiCalls');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// test
app.get('/test', (_req, res) => {
  res.send({ success: 'true' });
});

// index.html path
app.get('/', (_req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

// post requests from geonames
app.post('/api/coordination', (req, res) => {
  apiCalls.geonames(req.body.val, process.env.GEONAME_KEY)
    .then((data) => res.send(data));
});

// post requests from Pixabay
app.post('/api/image', (req, res) => {
  apiCalls.getImage(req.body.trip, process.env.PIXABAY_KEY)
    .then((data) => res.send(data));
});

// post requests from weatherapi
app.post('/api/weather', (req, res) => {
  apiCalls.gethWeather(req.body.trip, req.body.days, process.env.WEATHER_KEY)
    .then((data) => res.send(data));
});

// trips path
app.get('/index', (_req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

module.exports = app;
