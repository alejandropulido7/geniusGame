import { createContext } from "react";

export const ChallengeContext = createContext({
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