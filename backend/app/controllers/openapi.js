const axios = require('axios');

const openapi_key = process.env.OPENIA_API;

let conversationHistory = [
    { 
        "role": "system", 
        "content": "You are an assistant that provides movie titles." 
    }
];

const newMovie = 'Give me always a different random movie title in English and Spanish following the json format: key for english title: movie_english, key for spanish: movie_spanish';

async function getRandomMovie(req, res) {
    const userMessage = req.body.message; // Get the user's message from the request

    // Add the user's message to the conversation history
    conversationHistory.push({ role: 'user', content: newMovie });

    try {
        // Call OpenAI API with the conversation history
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: conversationHistory // Send the full conversation history
        }, {
            headers: {
                'Authorization': `Bearer ${openapi_key}`,
                'Content-Type': 'application/json'
            }
        });

        const assistantMessage = response.data.choices[0].message.content;

        // Add assistant's response to the conversation history
        conversationHistory.push({ role: 'assistant', content: assistantMessage });

        // Return the assistant's response to the user
        res.json({ response: assistantMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {getRandomMovie}