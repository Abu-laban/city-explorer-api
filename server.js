'use strict';

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
server.use(cors());

const weatherData = require('./data/weather.json')


const PORT = process.env.PORT;


server.get('/', (request, response) => {
    response.status(200).send('Hello This Is Home Route')
});

server.get('/weather', (request, response) => {

    const weatherSummaries = weatherData.find(city => {
        if (city.city_name == request.query.cityName) {
            return city;
        }

    });

    const newWeatherSummaries = weatherSummaries.data.map(day => {
        return new Weather(day.weather.description, day.valid_date)
    })

    response.status(200).send(newWeatherSummaries)
});

server.get('*', (req, res) => {
    res.status(500).send('NOT FOUND')
})

class Weather {
    constructor(des, date) {
        this.des = des;
        this.date = date;
    }
}
server.listen(PORT, () => console.log(`listening on ${PORT}`));