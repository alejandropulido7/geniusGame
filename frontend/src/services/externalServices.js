import axios from 'axios';

async function getQuestionTrivia() {
    try {
        const response = await axios.get(`http://localhost:5000/api/trivia?amount=1`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export {getQuestionTrivia}