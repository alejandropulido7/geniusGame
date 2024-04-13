import { createContext } from "react";

export const GlobalContext = createContext({
    activeChallenge: false,
    dataChallenge: {},
    setDataChallenge: (data)=>{},
    setActiveChallenge: (data)=>{}
});

export const ChainWordsContext = createContext({
    lastWord: '',
    newWord: '',
    arrayWords: [],
    setLastWord: (data) => {},
    setNewWord: (data) => {},
    setArrayWords: (data) => {}
});

export const HungedContext = createContext({
    secretWord: '',
    wordShowed: '',
    missedAttemps: 5,
    lettersGuessed: [],
    gameFinished: false,
    setSecretWord: (data) => {},
    setWordShowed: (data) => {},
    setMissedAttemps: (data) => {},
    setLettersGuessed: (data) => {},
    setGameFinished: (data) => {}
});
