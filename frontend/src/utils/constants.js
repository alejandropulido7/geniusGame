import pictionary from '../assets/challenges/pictionary.svg';
import hunged from '../assets/challenges/hunged.svg';
import acting from '../assets/challenges/acting.svg';
import word_chain from '../assets/challenges/word_chain.svg';
import trivia from '../assets/challenges/trivia.svg';
import whistle from '../assets/challenges/whistle.svg';
import home from '../assets/challenges/home.svg';

const PICTIONARY = 'pictionary';
const WORD_CHAIN = 'word_chain'; //Palabras encadenadas por la ultima letra
const HUNGED = 'hunged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const FLAGS = ['blue', 'red', 'purple', 'green'];

const OPTIONS_CHALLENGES = new Map();
OPTIONS_CHALLENGES.set(WORD_CHAIN, {
  title: 'Cadena de palabras',
  description: 'When your partners guess the word, click on Finish',
  topics: ['Paises', 'Comida', 'Frutas', 'Emociones', 'Nombres femeninos', 'Nombres masculinos', 'Deportes', 'Artistas musicales', 'Canciones']
});
OPTIONS_CHALLENGES.set(ACTING, {
  title: 'Actuacion',
  description: 'When your partners guess the word, click on Finish'
});
OPTIONS_CHALLENGES.set(WHISTLE_SONG, {
  title: 'Silba o tararea',
  description: 'When your partners guess the song, click on Finish'
});
OPTIONS_CHALLENGES.set(HUNGED, {
  title: 'Ahorcado',
  description: 'Intenta adivinar la palabra que uno de tus oponentes te ponga'
});
OPTIONS_CHALLENGES.set(PICTIONARY, {
  title: 'Pictionary',
  description: 'Intenta adivinar la palabra que uno de tus oponentes te ponga'
});
OPTIONS_CHALLENGES.set(BACK_HOME, {
  title: 'Devolverse al inicio',
  description: 'Intenta adivinar la palabra que uno de tus oponentes te ponga'
});

const RENDER_CHALLENGE = {
  admin: 'ADMIN',
  opponent: 'OPPONENT_INTERACTIVE',
  player: 'PLAYER'
}


const CHALLENGES_IN_BOARD = [
    {id: PICTIONARY, name: 'Dibuja', icon: pictionary},
    {id: WORD_CHAIN, name: 'Cadena de palabras', icon: word_chain},
    {id: HUNGED, name: 'Ahorcado', icon: hunged},
    {id: TRIVIA, name: 'Preguntas', icon: trivia},
    {id: ACTING, name: 'Actuar', icon: acting},
    {id: BACK_HOME, name: 'Volver al inicio', icon: home},
    {id: WHISTLE_SONG, name: 'Silba o tararea', icon: whistle}
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

