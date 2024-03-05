import { createContext } from "react";

export const ChallengeContext = createContext({
    activeChallenge: false,
    dataChallenge: {},
    setDataChallenge: (data)=>{},
    setActiveChallenge: (data)=>{}
});