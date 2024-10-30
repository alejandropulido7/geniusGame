
const axios = require('axios');

const TMDB_KEY = process.env.TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';
const TOTAL_PAGES = 500;

async function getRandomMovie(req, res) {
    
    try {
        const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;
        const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_KEY}&include_adult=false&language=es-MX&page=${randomPage}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // const randomResult = Math.floor(Math.random() * 19) + 1;
        
        const result = response.data.results;

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {getRandomMovie}