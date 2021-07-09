'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function yelpHandler(request, response) {

    const sQuery = request.query.cityName

    let key = process.env.YELP_KEY;

    if (cache[`yelp ${sQuery}`] !== undefined) {
        response.status(200).send(cache[`yelp ${sQuery}`]);
    } else {
        let yelpREST = axios.create({
            baseURL: "https://api.yelp.com/v3/",
            headers: {
                Authorization: `Bearer ${key}`,
                "Content-type": "application/json",
            },
        })
        yelpREST("/businesses/search", {
            params: {
                location: sQuery,
            },
        }).then(({ data }) => {
            let { businesses } = data
            cache[`yelp ${sQuery}`] = businesses.map(yelpObj => new Yelp(yelpObj))
            response.status(200).send(businesses.map(yelpObj => {
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