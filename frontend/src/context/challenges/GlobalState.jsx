import React, {useReducer} from 'react'
import { GlobalContext } from './GlobalContext';



const GlobalState = ({children}) => {
    
    const initialState = {
        dataChallenge: {},
        activeChallenge: false
    }

    const challengeReducer = (state, action)=>{

        switch (action.type) {
            case 'DATA_CHALLENGE':
                return { ...state, dataChallenge: action.payload};
            case 'ACTIVE_CHALLENGE':
                return { ...state, activeChallenge: action.payload};        
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

    return (
        <GlobalContext.Provider value={{
            activeChallenge: state.activeChallenge,
            dataChallenge: state.dataChallenge,
            setDataChallenge,
            setActiveChallenge
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalState
