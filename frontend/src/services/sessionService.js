import axios from 'axios';
import { BACKEND } from '../utils/constants';

// const token = localStorage.getItem('authToken');

async function createSession(configGame, token) {
    try {
        const response = await axios.post(`${BACKEND}/api/sessions`, {
            configGame
        }, {
            headers: {
                'token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getSession(idRoom) {
    try {
        const response = await axios.get(`${BACKEND}/api/sessions?idRoom=${idRoom}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function updateBoardPositions(boardPositions, session_id) {
    try {
        const response = await axios.put(`${BACKEND}/api/sessions/updateBoard`, {
            session_id,
            boardPositions
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

export {getSession, createSession, updateBoardPositions}