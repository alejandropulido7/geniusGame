import React, { useEffect } from 'react';
import {hasCookie, setCookie} from '../../utils/cookies'

const IntroDesktop = ({setNextComponent}) => {

    const startGame = () => {
        setNextComponent('CONFIG');
    }

    useEffect(() => {
        setCookie('componentWolfGame', 'INTRO', 1);
    },[])

    return (
        <div>
            <h1>Estas en DESKTOP</h1>
            <button onClick={startGame}>Start game</button>
        </div>
    )
}

export default IntroDesktop
