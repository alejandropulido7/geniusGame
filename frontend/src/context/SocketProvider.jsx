import React, { createContext, useEffect, useReducer } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies';


export const SocketContext = createContext({
    token: null,
    socket: null,
    login: (data) => {},
    logout: (data) => {},
    setSocket: (data) => {},
});

export const SocketProvider = ({ children, isBoard=false }) => {

    const backend = import.meta.env.VITE_BACKEND || 'http://localhost:5002';
    const navigate = useNavigate();
    const initialState = {
        token: getCookie('token'),
        socket: null,
    }

    const socketReducer = (state, action) => {
        switch (action.type) {
            case 'SET_TOKEN':                               
                return { ...state, token: action.payload};
            case 'SET_SOCKET':                              
                return { ...state, socket: action.payload};     
            default:
                return state;
        }
    }

    const [state, dispatchAuth] = useReducer(socketReducer, initialState);

    const setToken = (data) => {
        dispatchAuth({
            type: 'SET_TOKEN',
            payload:  data
        });
    }

    const setSocket = (data) => {
        dispatchAuth({
            type: 'SET_SOCKET',
            payload:  data
        });
    }

    useEffect(() => {
        
        const token = getCookie('token');
        if(token){           
            const socket = io(backend, {
                auth: {token, isBoard},
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 5000,
                autoConnect: true
            });
            setSocket(socket);
            setToken(token);
            socket.on('connect_error', (error) => {
                console.error('Error de conexión al socket:', error.message);
                deleteCookie('token');
                setToken(null);
                setSocket(null);
                navigate('/');
            });
        } else {
            setSocket(null);
        }
    }, []);
        

    const login = (userToken) => {
        setToken(userToken);
        setCookie('token', userToken);
    };

    const logout = () => {
        setToken(null);
        deleteCookie('token');
    };


  return (
    <SocketContext.Provider value={{
        token: state.token,
        socket: state.socket,
        login,
        logout
    }}>
      {children}
    </SocketContext.Provider>
  );
};
