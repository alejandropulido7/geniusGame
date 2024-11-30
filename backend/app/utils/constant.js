const FLAGS = ['blue', 'red', 'purple', 'green'];
const triviaCategories = [
    {id: 9, name: 'General Knowledge'},
    {id: 10, name: 'Entertainment: Books'},
    {id: 11, name: 'Entertainment: Film'},
    {id: 12, name: 'Entertainment: Music'},
    // {id: 13, name: 'Entertainment: Musicals & Theatres'},
    // {id: 14, name: 'Entertainment: Television'},
    // {id: 15, name: 'Entertainment: Video Games'},
    // {id: 16, name: 'Entertainment: Board Games'},
    {id: 17, name: 'Science & Nature'},
    {id: 18, name: 'Science: Computers'},
    {id: 19, name: 'Science: Mathematics'},
    {id: 20, name: 'Mythology'},
    {id: 21, name: 'Sports'},
    {id: 22, name: 'Geography'},
    {id: 23, name: 'History'},
    // {id: 24, name: 'Politics'},
    {id: 25, name: 'Art'},
    {id: 26, name: 'Celebrities'},
    {id: 27, name: 'Animals'},
    {id: 28, name: 'Vehicles'},
    {id: 29, name: 'Entertainment: Comics'},
    {id: 30, name: 'Science: Gadgets'},
    // {id: 31, name: 'Entertainment: Japanese Anime & Manga'},
    {id: 32, name: 'Entertainment: Cartoon &amp; Animations'},
];

const PICTIONARY = 'pictionary';
const WORD_CHAIN = 'word_chain'; //Palabras encadenadas por la ultima letra
const HUNGED = 'hunged';
const TRIVIA = 'trivia';
const ACTING = "acting";
const WHISTLE_SONG = "whistle_song" //silbar cancion que el oponente ponga
const BACK_HOME = 'back_home';
const TRIVIA_VS = 'trivia_vs';

const CHALLENGES_IN_BOARD = [
    {id: PICTIONARY, name: 'Dibuja', icon: 'pictionary'},
    {id: WORD_CHAIN, name: 'Cadena de palabras', icon: 'word_chain'},
    {id: HUNGED, name: 'Ahorcado', icon: 'hunged'},
    {id: TRIVIA, name: 'Preguntas', icon: 'trivia'},
    {id: ACTING, name: 'Actuar', icon: 'acting'},
    {id: BACK_HOME, name: 'Volver al inicio', icon: 'home'},
    {id: WHISTLE_SONG, name: 'Silba o tararea', icon: 'whistle'}
];

module.exports = {FLAGS, 
    triviaCategories, 
    CHALLENGES_IN_BOARD,
    PICTIONARY, 
    WORD_CHAIN, 
    HUNGED, 
    TRIVIA, 
    TRIVIA_VS};

            