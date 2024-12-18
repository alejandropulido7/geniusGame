import React, {useEffect, useReducer} from 'react'
import { AuthContext } from './GlobalContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';

const AuthState = ({children}) => {

    const backend = import.meta.env.VITE_BACKEND || 'http://localhost:5000';
    const navigate = useNavigate();
    const initialState = {
        token: null,
        socket: null,
    }

    const authReducer = (state, action) => {
        switch (action.type) {
            case 'SET_TOKEN':                               
                return { ...state, token: action.payload};
            case 'SET_SOCKET':                              
                return { ...state, socket: action.payload};     
            default:
                return state;
        }
    }

    const [state, dispatchAuth] = useReducer(authReducer, initialState);

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
                auth: {token},
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
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
        <AuthContext.Provider value={{
            token: state.token,
            socket: state.socket,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthState
