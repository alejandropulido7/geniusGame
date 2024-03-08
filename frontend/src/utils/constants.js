const PICTIONARY = 'pictionary';
const WORD_CHAIN = 'word_chain'; //Palabras encadenadas por la ultima letra
const HUNGED = 'hunged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const FLAGS = ['blue', 'red', 'purple', 'green'];
const OPTIONS_CHALLENGES = {
  acting: {
      title: 'Act according to the word',
      description: 'When your partners guess the word, click on Finish'
  },
  whistle_song: {
    title: 'Whistle the song that they give you',
    description: 'When your partners guess the song, click on Finish'
  }
}
const RENDER_CHALLENGE = {
  admin: 'ADMIN',
  opponent: 'OPPONENT_INTERACTIVE',
  player: 'PLAYER'
}


const CHALLENGES_IN_BOARD = [
    PICTIONARY,
    WORD_CHAIN,
    HUNGED,
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

export {CHALLENGES_IN_BOARD, 
  PICTIONARY, 
  WORD_CHAIN, 
  HUNGED, 
  TRIVIA, 
  ACTING, 
  BACK_HOME, 
  WHISTLE_SONG, 
  getRandomObject, 
  FLAGS, 
  OPTIONS_CHALLENGES, 
  RENDER_CHALLENGE}

