import axios from 'axios';

async function loginService(email, password) {
    try {
        const response = await axios.post(`http://localhost:5002/api/auth/login`, {
            email, password
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function validateUserToken(token) {
    try {
        const response = await axios.get(`http://localhost:5002/api/auth/validateUserToken/${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function validateSessionToken(token) {
    try {
        const response = await axios.get(`http://localhost:5002/api/auth/validateSessionToken/${token}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {loginService, validateUserToken, validateSessionToken}