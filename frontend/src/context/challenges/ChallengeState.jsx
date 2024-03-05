import React, {useReducer} from 'react'
import { ChallengeContext } from './ChallengeContext';



const ChallengeState = ({children}) => {
    
    const initialState = {
        dataChallenge: {},
        activeChallenge: false
    }

    const challengeReducer = (state, action)=>{
        if(action.type === 'DATA_CHALLENGE') {
            return { ...state, dataChallenge: action.payload};
        }
        if(action.type === 'ACTIVE_CHALLENGE') {
            return { ...state, activeChallenge: action.payload};
        }
        return state;        
    }

    const [state, dispatch] = useReducer(challengeReducer, initialState);

    const setDataChallenge = (data) => {   
        console.log('dispatch')
        console.log(data)     
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
        <ChallengeContext.Provider value={{
            activeChallenge: state.activeChallenge,
            dataChallenge: state.dataChallenge,
            setDataChallenge,
            setActiveChallenge
        }}>
            {children}
        </ChallengeContext.Provider>
    )
}

export default ChallengeState
