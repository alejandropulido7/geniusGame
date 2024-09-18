const generateUniqueId = require('generate-unique-id');
const {FLAGS} = require('../utils/constant')

const generateUUID = (length, letters=true) => {
    return generateUniqueId({
      length,
      useLetters: letters,
      useNumbers: true
    });
  }

const createBoard = (boardLenght, amountChallenges, challengesInBoard) => {
  const positionsBoard = Array.from({ length: boardLenght }, (_, index) => index + 1);      
  let newPositions = [];
  let addflagPositions = [];
  positionsBoard.forEach(position => {
    newPositions.push({position: position, challenge: ''});
  });
  FLAGS.map( flag => {
    addflagPositions.push({flag: flag, positions: generateNewSteps(newPositions, boardLenght, amountChallenges, challengesInBoard)});
  }); 
  return addflagPositions; 
};

const generateNewSteps = (array, boardLenght, amountChallenges, challengesInBoard) => {
  let positionsChallenges = [...array]
  for (let index = 0; index < amountChallenges; index++) {
    const random = Math.floor(Math.random() * boardLenght) + 1;
    positionsChallenges = positionsChallenges.map(item => item.position == random && (random > 1 && random != boardLenght) ? {...item, challenge: getRandomObject(challengesInBoard).id} : item);
  }
  return positionsChallenges;
}

const getRandomObject = (objectsArray) => {
  if (objectsArray.length === 0) {
    return null;  
  }
  const randomIndex = Math.floor(Math.random() * objectsArray.length);
  return objectsArray[randomIndex];
}


module.exports = {generateUUID, createBoard, getRandomObject};