'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function yelpHandler(request, response) {

    const sQuery = request.query.cityName

    let url = {
        baseURL: 'https://api.yelp.com/v3/',
        headers: {
            Authorization: `Bearer ${process.env.YELP_KEY}`,
            'Content-type': 'application/json',
        },
    };

    if (cache[`yelp ${sQuery}`] !== undefined) {
        response.status(200).send(cache[`yelp ${sQuery}`]);
    }
    else {

        let yelpData = axios.create(url);

        yelpData('/businesses/search', {
            params: {
                location: sQuery,
                term: sQuery,
                limit: 10,
            },
        }).then(({ data }) => {

            let yData = data.businesses.map(yelpObj => new Yelp(yelpObj))

            cache[`yelp ${sQuery}`] = yData

            response.status(200).send(yData)

        })
            .catch(error => {
                response.status(500).send(error)
            })
    }
}


class Yelp {
    constructor(yelpObj) {
        this.name = yelpObj.name;
        this.image_url = yelpObj.image_url;
        this.price = yelpObj.price;
        this.rating = yelpObj.rating;
        this.url = yelpObj.url;
    }

}


module.exports = yelpHandler;