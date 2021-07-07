'use strict';

const axios = require('axios')

function weatherHandler(request, response) {

    const sQuery = request.query.cityName

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${sQuery}&key=${process.env.WEATHER_KEY}&day=7`

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

class Weather {
    constructor(day) {
        this.des = day.weather.description;
        this.date = day.datetime;
    }
}

module.exports = weatherHandler;