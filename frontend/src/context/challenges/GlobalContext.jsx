import { createContext } from "react";

export const GlobalContext = createContext({
    activeChallenge: false,
    dataChallenge: {},
    renderPlayer: '',
    session: {}, 
    setSession: (data)=>{},
    setDataChallenge: (data)=>{},
    setActiveChallenge: (data)=>{},
    setRenderPlayer: (data)=>{}
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
