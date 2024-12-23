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

async function getRandomWords() {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/randomWord`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getTokenSpotify() {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/spotify/getToken`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getArtists(artist, token) {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/spotify/getArtists?artist=${artist}&spotify_token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getSongs(id_artist, token) {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/spotify/getSongs?id_artist=${id_artist}&spotify_token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {getRandomMovie, getRandomWords, getTokenSpotify, getArtists, getSongs}