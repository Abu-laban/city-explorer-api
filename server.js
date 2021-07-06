'use strict';

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const axios = require('axios')

server.use(cors());

const weatherData = require('./data/weather.json')


const PORT = process.env.PORT;


server.get('/', (request, response) => {
    response.status(200).send('Hello This Is Home Route')
});

server.get('/test', testHandler)

function testHandler(request, response) {
    response.status(200).send('all good');
}

server.get('/weather', weatherHandler);

function weatherHandler(request, response) {

    const sQuery = request.query.cityName

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${sQuery}&key=${process.env.WEATHER_KEY}`

    axios
        .get(url)
        .then(weatherData => {

            response.status(200).send(weatherData.data.data.map(day => {
                return new Weather(day)
            }))

        })
        .catch(error => {
            response.status(500).send(error)
        })


};

server.get('*', (request, response) => {
    response.status(500).send('NOT FOUND')
})

class Weather {
    constructor(day) {
        this.des = day.weather.description;
        this.date = day.datetime;
    }
}
server.listen(PORT, () => console.log(`listening on ${PORT}`));