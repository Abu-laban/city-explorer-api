'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function yelpHandler(request, response) {

    const sQuery = request.query.cityName

    let url = `https://api.yelp.com/v3/businesses/search?location=${sQuery}`;

    let key = process.env.YELP_KEY;

    if (cache[`y ${sQuery}`] !== undefined) {
        response.status(200).send(cache[`y ${sQuery}`]);
    } else {
        axios
            .get(url)
            .set('Authorization', 'Bearer ' + `${key}`)
            .then(yelpData => {

                cache[`y ${sQuery}`] = yelpData.data.businesses.map(yelpObj => new Yelp(yelpObj))

                response.status(200).send(yelpData.data.businesses.map(yelpObj => {
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