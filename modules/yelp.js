'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function yelpHandler(request, response) {

    const sQuery = request.query.cityName

    let yelpURL = `https://api.yelp.com/v3/businesses/search?location=${sQuery}`;

    if (cache[locationSearch] !== undefined) {
        response.status(200).send(cache[locationSearch]);
    } else {
        axios
            .get(yelpURL)
            .set({ 'Authorization': 'Bearer ' + process.env.YELP_KEY })
            .then(yelpData => {

                cache[locationSearch] = yelpData.body.businesses.map(yelpObj => new Yelp(yelpObj))

                response.status(200).send(yelpData.body.businesses.map(yelpObj => {
                    return new Yelp(yelpObj);
                }))

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