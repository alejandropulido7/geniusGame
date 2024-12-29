import React, {useEffect, useReducer} from 'react'
import { GlobalContext } from './GlobalContext';
import {getSession} from '../services/sessionService';
import {useParams, useNavigate} from 'react-router-dom';



const GlobalState = ({children}) => {
    const {idRoom} = useParams();
    
    const initialState = {
        dataChallenge: {},
        activeChallenge: false,
        renderPlayer: '',
        session: {},
        wakeLock: null,
        status: ''
    }

    const challengeReducer = (state, action)=>{

        switch (action.type) {
            case 'DATA_CHALLENGE':
                return { ...state, dataChallenge: action.payload};
            case 'ACTIVE_CHALLENGE':
                return { ...state, activeChallenge: action.payload};
            case 'RENDER_CHALLENGE':
                return { ...state, renderPlayer: action.payload};
            case 'RENDER_SESSION':
                return { ...state, session: action.payload}; 
            case 'SET_WAKELOCK':
                return { ...state, wakeLock: action.payload};
            case 'SET_STATUS':
                return { ...state, status: action.payload}; 
            default:
                return state;
        }       
    }

    const [state, dispatch] = useReducer(challengeReducer, initialState);

    const setDataChallenge = (data) => {   
        dispatch({
            type: 'DATA_CHALLENGE',
            payload: data
        })
    }

    const setActiveChallenge = (data) => {        
        dispatch({
            type: 'ACTIVE_CHALLENGE',
            payload: data
        })
    }

    const setRenderPlayer = (data) => {        
        dispatch({
            type: 'RENDER_CHALLENGE',
            payload: data
        })
    }

    const setSession = (data) => {        
        dispatch({
            type: 'RENDER_SESSION',
            payload: data
        })
    }

    const setWakeLock = (data) => {        
        dispatch({
            type: 'SET_WAKELOCK',
            payload: data
        })
    }

    const setStatus = (data) => {        
        dispatch({
            type: 'SET_STATUS',
            payload: data
        })
    }

    return (
        <GlobalContext.Provider value={{
            activeChallenge: state.activeChallenge,
            dataChallenge: state.dataChallenge,
            renderPlayer: state.renderPlayer,
            session: state.session,
            wakeLock: state.wakeLock,
            status: state.status,
            setDataChallenge,
            setActiveChallenge,
            setRenderPlayer,
            setSession,
            setWakeLock,
            setStatus
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalState
