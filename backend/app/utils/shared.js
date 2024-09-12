const generateUniqueId = require('generate-unique-id');

const generateUUID = (length, letters=true) => {
    return generateUniqueId({
      length,
      useLetters: letters,
      useNumbers: true
    });
  }

module.exports = {generateUUID};