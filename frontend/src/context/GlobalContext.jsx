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

export const AuthContext = createContext({
    token: null,
    socket: null,
    login: (data) => {},
    logout: (data) => {},
    setSocket: (data) => {},
});

