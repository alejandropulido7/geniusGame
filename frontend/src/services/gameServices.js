import axios from 'axios';
import { BACKEND } from '../utils/constants';


async function getRandomMovie() {
    try {
        const response = await axios.get(`${BACKEND}/api/movies/random`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {getRandomMovie}