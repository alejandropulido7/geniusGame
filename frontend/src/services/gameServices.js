import axios from 'axios';
import { BACKEND } from '../utils/constants';
import axiosInstance from './axiosInstance';


async function getRandomMovie() {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/movies/random`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {getRandomMovie}