const axios = require('axios');
const {translateText} = require('./translate');

async function getRandomWords(req, res) {
    try {
      const response = await axios.get('https://random-word-api.herokuapp.com/word?number=20&lang=es');
      const arrayWords = response.data;
      let words = [];
      const wordsTranslated = await translateText(arrayWords, 'ES');
      console.log(wordsTranslated);
      wordsTranslated.forEach(element => {
        const wordElement = replaceSpanishAccentedVowels(element.text);
        words.push(wordElement);
      });
      res.json(words);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo preguntas: '+error });
    }
};

function replaceSpanishAccentedVowels(inputString) {
  const accentedVowels = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'Á': 'A',
      'É': 'E',
      'Í': 'I',
      'Ó': 'O',
      'Ú': 'U'
  };

  return inputString.toLowerCase().replace(/[áéíóúÁÉÍÓÚ]/g, match => accentedVowels[match]);
}

module.exports = {getRandomWords}