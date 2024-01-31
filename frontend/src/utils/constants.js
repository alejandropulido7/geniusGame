const PICTIONARY = 'pictionary';
const FIRST_WORD = 'word_chain'; //Palabras encadenadas por la ultima letra
const HANGED = 'hanged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const FLAGS = ['blue', 'red', 'purple', 'green'];


const CHALLENGES_IN_BOARD = [
    PICTIONARY,
    FIRST_WORD,
    HANGED,
    TRIVIA,
    ACTING,
    BACK_HOME,
    WHISTLE_SONG
];

const getRandomObject = (arrayDeObjetos) => {
    if (arrayDeObjetos.length === 0) {
      return null;  
    }
    const indiceAleatorio = Math.floor(Math.random() * arrayDeObjetos.length);
    return arrayDeObjetos[indiceAleatorio];
  }

export {CHALLENGES_IN_BOARD, PICTIONARY, FIRST_WORD, HANGED, TRIVIA, ACTING, BACK_HOME, getRandomObject, FLAGS}

