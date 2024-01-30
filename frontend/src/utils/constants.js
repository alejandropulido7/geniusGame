const PICTIONARY = 'pictionary';
const FIRST_WORD = 'first_word';
const HANGED = 'hanged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const BACK_HOME = 'back_home';
const FLAGS = ['blue', 'red', 'purple', 'green'];


const CHALLENGES_IN_BOARD = [
    PICTIONARY,
    FIRST_WORD,
    HANGED,
    TRIVIA,
    ACTING,
    BACK_HOME
];

const getRandomObject = (arrayDeObjetos) => {
    if (arrayDeObjetos.length === 0) {
      return null;  
    }
    const indiceAleatorio = Math.floor(Math.random() * arrayDeObjetos.length);
    return arrayDeObjetos[indiceAleatorio];
  }

export {CHALLENGES_IN_BOARD, PICTIONARY, FIRST_WORD, HANGED, TRIVIA, ACTING, BACK_HOME, getRandomObject, FLAGS}

