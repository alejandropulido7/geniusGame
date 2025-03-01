const he = require('he');
const axios = require('axios');
const {triviaCategories} = require('../utils/constant');
const {translateText} = require('./translate');
//another api trivia https://the-trivia-api.com/v2/questions?limit=50 (other json format)


async function getQuestionTrivia(req, res) { 
    const amount = req.query.amount;
    try {
        const response = await getConnectTrivia(amount); 

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo preguntas: '+error });
    }
    
};


async function getConnectTrivia() {
    const randomIndex = Math.floor(Math.random() * triviaCategories.length);
    const categoryRequest = triviaCategories[randomIndex];
    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&category=${categoryRequest.id}`);
        const data = response.data.results[0];
        
        let question = he.decode(data.question);
        let incorrectAnswers = [...data.incorrect_answers];
        incorrectAnswers.map(answer => he.decode(answer));
        let correctAnswer = he.decode(data.correct_answer);
        let category = he.decode(data.category);

        const translate = await translateText([question, ...incorrectAnswers, correctAnswer, category]);

        question = translate[0].text;
        incorrectAnswers = [translate[1].text, translate[2].text, translate[3].text]
        correctAnswer = translate[4].text;
        category = translate[5].text;

        let options = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

        return {category, question, options, correctAnswer};
    } catch (error) {
        throw new Error('Error obteniendo preguntas: '+error );
    }    
};

module.exports = {getQuestionTrivia, getConnectTrivia}