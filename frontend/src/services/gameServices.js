import axios from 'axios';

async function getRandomMovie() {
    try {
        const response = await axios.get(`http://localhost:5002/api/movies/random`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {getRandomMovie}