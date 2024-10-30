import axios from 'axios';
import { BACKEND } from '../utils/constants';
import axiosInstance from './axiosInstance';

async function createSession(configGame) {
    try {
        const response = await axiosInstance.post(`${BACKEND}/api/sessions`, {
            configGame
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getSession(idRoom) {
    try {
        const response = await axiosInstance.get(`${BACKEND}/api/sessions?idRoom=${idRoom}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function updateBoardPositions(boardPositions, session_id) {
    try {
        const response = await axiosInstance.put(`${BACKEND}/api/sessions/updateBoard`, {
            session_id,
            boardPositions
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

export {getSession, createSession, updateBoardPositions}