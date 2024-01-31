import axios from 'axios';


async function createSession(codeSession, idHost, configGame) {
    try {
        const response = await axios.post(`http://localhost:5000/api/sessions`, {
            codeSession,
            idHost,
            configGame
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getSession(idRoom) {
    try {
        const response = await axios.get(`http://localhost:5000/api/sessions?idRoom=${idRoom}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function updateBoardPositions(boardPositions, session_id) {
    try {
        const response = await axios.put(`http://localhost:5000/api/sessions/updateBoard`, {
            session_id,
            boardPositions
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

export {getSession, createSession, updateBoardPositions}