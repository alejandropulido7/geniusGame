const axios = require('axios');

const deeplApiKey = process.env.DEEPL_API;

async function translateText(texts, language = 'ES', source = '') {
    try {
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate', {
          source_lang: source,
          text: texts,
          target_lang: language,
        }, 
        {
            headers: {
            "Authorization": `DeepL-Auth-Key ${deeplApiKey}`,
            "Content-Type": 'application/json'
            }
        });
      return response.data.translations;
    } catch (error) {
        throw new Error('Error traduciendo: ' + error);
    }
};

module.exports = {translateText};