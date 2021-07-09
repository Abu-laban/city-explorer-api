'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function yelpHandler(request, response) {

    const sQuery = request.query.cityName


    if (cache[`yelp ${sQuery}`] !== undefined) {
        response.status(200).send(cache[`yelp ${sQuery}`]);
    } else {
        let yelpGQL = axios.create({
            url: "https://api.yelp.com/v3/graphql",
            headers: {
                Authorization: `Bearer ${process.env.YELP_KEY}`,
                "Content-type": "application/json",
            },
            method: "POST",
        })
        yelpGQL({
            data: JSON.stringify({
                query: `{
              search(term: "coffee",
                      location: "kyoto",
                      limit: 10) {
                  business {
                      name
                      image_url
                      price
                      rating
                      url
                  }
              }
          }`,
            }),
        }).then(({ data }) => {
            let businesses = data.data.search.business

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