/*Challenges images */
import pictionary from '../assets/images/challenges/pictionary.png';
import hunged from '../assets/images/challenges/hunged.png';
import acting from '../assets/images/challenges/acting.png';
import word_chain from '../assets/images/challenges/word_chain.png';
import trivia from '../assets/images/challenges/trivia.png';
import whistle from '../assets/images/challenges/whistle.png';
import home from '../assets/images/challenges/home.png';

/*Flags images */

const colorsApp = new Map();
colorsApp.set('blue', {color: '#4047C1', shadow: '#1C2893'});
colorsApp.set('red', {color: '#B71515', shadow: '#7F1111'});
colorsApp.set('purple', {color: '#7015B7', shadow: '#50108E'});
colorsApp.set('green', {color: '#0A854B', shadow: '#066334'});

const colorOptionsTrivia = (index) => {
  switch (index) {
    case 0:        
      return colorsApp.get('purple').color;
    case 1:        
      return colorsApp.get('red').color;
    case 2:        
      return colorsApp.get('green').color;
    case 3:        
      return colorsApp.get('blue').color;
    default:
      break;
  }
}


const PICTIONARY = 'pictionary';
const WORD_CHAIN = 'word_chain'; //Palabras encadenadas por la ultima letra
const HUNGED = 'hunged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const TRIVIA_VS = 'trivia_vs';
const FLAGS = [
  {id: 'blue', name: 'Azul', color: colorsApp.get('blue').color, shadow: colorsApp.get('blue').shadow}, 
  {id: 'red', name: 'Rojo', color: colorsApp.get('red').color, shadow: colorsApp.get('red').shadow}, 
  {id: 'purple', name: 'Morado', color: colorsApp.get('purple').color, shadow: colorsApp.get('purple').shadow}, 
  {id: 'green', name: 'Verde', color: colorsApp.get('green').color, shadow: colorsApp.get('green').shadow}
];

const PROP_PIECES = [
  {id: 'beach', name: 'Playa', color: 'e9862a', emoji: '🌴'},
  {id: 'travel', name: 'Viajes', color: 'fbff39', emoji: '✈'},
  {id: 'eat', name: 'Comer', color: '6de212', emoji: '🍕'},
  {id: 'christmas', name: 'Navidad', color: '40a1ff', emoji: '⛄'},
  {id: 'sport', name: 'Deportes', color: '9f5bff', emoji: '⚽'}
]

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
OPTIONS_CHALLENGES.set(TRIVIA, {
  title: 'Juego de preguntas',
  description: 'Responde la pregunta correctamente para poder avanzar'
});
OPTIONS_CHALLENGES.set(TRIVIA_VS, {
  title: 'Reto de preguntas',
  description: 'El que responda correctamente en el menor tiempo posible gana!'
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
  TRIVIA_VS, 
  getRandomObject, 
  FLAGS, 
  OPTIONS_CHALLENGES, 
  RENDER_CHALLENGE,
  findFlagProperties,
  colorsApp,
  PROP_PIECES,
  colorOptionsTrivia}

