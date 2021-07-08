'use strict';

const axios = require('axios')
let cache = require('./cache.js');

function moviesHandler(request, response) {

    const sQuery = request.query.cityName

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_KEY}&query=${sQuery}`

    if (cache[sQuery] !== undefined) {
        response.status(200).send(cache[sQuery]);
    } else {
        axios
            .get(url)
            .then(moviesData => {

                cache[sQuery] = moviesData.data.results.map(obj => new Movies(obj))

                response.status(200).send(moviesData.data.results.map(obj => {
                    return new Movies(obj)
                }))

            })
            .catch(error => {
                response.status(500).send(error)
            })
    }

};

class Movies {
    constructor(obj) {
        this.title = obj.original_title;
        this.overview = obj.overview;
        this.average_votes = obj.vote_average;
        this.total_votes = obj.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500/${obj.poster_path}`;
        this.popularity = obj.popularity;
        this.released_on = obj.release_date;
    }

}

module.exports = moviesHandler;