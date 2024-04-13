import React, {useReducer} from 'react'
import { ChainWordsContext } from './GlobalContext';



const ChainWordChallengeState = ({children}) => {
    
    const initialState = {
        lastWord: '',
        newWord: '',
        arrayWords: [],
    }

    const chainWordReducer = (state, action)=>{
        if(action.type === 'SET_LASTWORD') {
            return { ...state, lastWord: action.payload};
        }
        if(action.type === 'SET_NEWWORD') {
            return { ...state, newWord: action.payload};
        }
        if(action.type === 'SET_ARRAYWORDS') {
            return { ...state, arrayWords: action.payload};
        }
        return state;        
    }

    const [state, dispatchChainWord] = useReducer(chainWordReducer, initialState);

    const setLastWord = (data) => {
        dispatchChainWord({
            type: 'SET_LASTWORD',
            payload:  data
        });
    }

    const setNewWord = (data) => {
        dispatchChainWord({
            type: 'SET_NEWWORD',
            payload:  data
        });
    }

    const setArrayWords = (data) => {
        dispatchChainWord({
            type: 'SET_ARRAYWORDS',
            payload:  data
        });
    }

    return (
        <ChainWordsContext.Provider value={{
            lastWord: state.lastWord,
            newWord: state.newWord,
            arrayWords: state.arrayWords,
            setLastWord,
            setNewWord,
            setArrayWords
        }}>
            {children}
        </ChainWordsContext.Provider>
    )
}

export default ChainWordChallengeState
