import axios from 'axios';
import { BACKEND } from '../utils/constants';


async function loginService(email, password) {
    try {
        const response = await axios.post(`${BACKEND}/api/auth/login`, {
            email, password
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function validateUserToken(token) {
    try {
        const response = await axios.get(`${BACKEND}/api/auth/validateUserToken/${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function validateSessionToken(token) {
    try {
        const response = await axios.get(`${BACKEND}/api/auth/validateSessionToken/${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {loginService, validateUserToken, validateSessionToken}