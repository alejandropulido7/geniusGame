import { createContext } from "react";

export const GlobalContext = createContext({
    activeChallenge: false,
    dataChallenge: {},
    renderPlayer: '',
    session: {}, 
    wakeLock: null,
    status: '',
    setSession: (data)=>{},
    setDataChallenge: (data)=>{},
    setActiveChallenge: (data)=>{},
    setRenderPlayer: (data)=>{},
    setWakeLock: (data)=>{},
    setStatus: (data)=>{}
});

export const AuthContext = createContext({
    token: null,
    socket: null,
    login: (data) => {},
    logout: (data) => {},
    setSocket: (data) => {},
});

