import React, {useReducer} from 'react'
import { HungedContext } from './GlobalContext';

const HungedChallengeState = ({children}) => {

    const initialState = {
        secretWord: '',
        wordShowed: '',
        missedAttemps: 5,
        lettersGuessed: [],
        gameFinished: false,
    }

    const hungedReducer = (state, action) => {
        switch (action.type) {
            case 'SET_SECRETWORD': 
                              
                return { ...state, secretWord: action.payload};
            case 'SET_WORDSHOWED':
                console.log('SET_WORDSHOWED', state)                 
                return { ...state, wordShowed: action.payload}; 
            case 'SET_MISSEDATTEMPS':
                console.log('SET_MISSEDATTEMPS', state)                
                return { ...state, missedAttemps: action.payload}; 
            case 'SET_LETTERSGUESSED': 
                console.log('SET_LETTERSGUESSED', state)               
                return { ...state, lettersGuessed: action.payload}; 
            case 'SET_GAMEFINISHED':                
                return { ...state, gameFinished: action.payload};       
            default:
                return state;
        }
    }

    const [state, dispatchHunged] = useReducer(hungedReducer, initialState);

    const setSecretWord = (data) => {
        dispatchHunged({
            type: 'SET_SECRETWORD',
            payload:  data
        });
    }

    const setWordShowed = (data) => {
        dispatchHunged({
            type: 'SET_WORDSHOWED',
            payload:  data
        });
    }

    const setMissedAttemps = (data) => {
        dispatchHunged({
            type: 'SET_MISSEDATTEMPS',
            payload:  data
        });
    }

    const setLettersGuessed = (data) => {
        dispatchHunged({
            type: 'SET_LETTERSGUESSED',
            payload:  data
        });
    }

    const setGameFinished = (data) => {
        dispatchHunged({
            type: 'SET_GAMEFINISHED',
            payload:  data
        });
    }



    return (
        <HungedContext.Provider value={{
            secretWord: state.secretWord,
            gameFinished: state.gameFinished,
            lettersGuessed: state.lettersGuessed,
            missedAttemps: state.missedAttemps,
            wordShowed: state.wordShowed,
            setGameFinished,
            setLettersGuessed, 
            setMissedAttemps, 
            setSecretWord, 
            setWordShowed
        }}>
            {children}
        </HungedContext.Provider>
    )
}

export default HungedChallengeState
