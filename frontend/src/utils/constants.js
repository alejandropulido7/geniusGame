/*Challenges images */
import pictionary from '../assets/images/challenges/pictionary.png';
import hunged from '../assets/images/challenges/hunged.png';
import acting from '../assets/images/challenges/acting.png';
import word_chain from '../assets/images/challenges/word_chain.png';
import trivia from '../assets/images/challenges/trivia.png';
import whistle from '../assets/images/challenges/whistle.png';
import home from '../assets/images/challenges/home.png';

/*Flags images */

const PICTIONARY = 'pictionary';
const WORD_CHAIN = 'word_chain'; //Palabras encadenadas por la ultima letra
const HUNGED = 'hunged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const FLAGS = [
  {id: 'blue', name: 'Azul', color: '#4047C1', shadow: '#1C2893'}, 
  {id: 'red', name: 'Rojo', color: '#B71515', shadow: '#7F1111'}, 
  {id: 'purple', name: 'Morado', color: '#7015B7', shadow: '#50108E'}, 
  {id: 'green', name: 'Verde', color: '#0A854B', shadow: '#066334'}
];

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
  description: '😣😣😣'
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

const findFlagProperties = (flag) => {
  return FLAGS.find(flagFound => flagFound.id == flag);
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
  RENDER_CHALLENGE,
  findFlagProperties}

