import generateUniqueId from 'generate-unique-id';

const generateUUID = (length) => {
    return generateUniqueId({
      length,
      useLetters: true,
      useNumbers: true
    });
  }

export {generateUUID};