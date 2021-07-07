'use strict';

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const axios = require('axios')

server.use(cors());

const weatherData = require('./data/weather.json')
const weatherHandler = require('./modules/weather');
const moviesHandler = require('./modules/movies');

const PORT = process.env.PORT;


server.get('/', (request, response) => {
    response.status(200).send('Hello This Is Home Route')
});

server.get('/test', testHandler)

function testHandler(request, response) {
    response.status(200).send('all good');
}

server.get('/weather', weatherHandler);



server.get('/movies', moviesHandler);



server.get('*', (request, response) => {
    response.status(500).send('NOT FOUND')
})





server.listen(PORT, () => console.log(`listening on ${PORT}`));