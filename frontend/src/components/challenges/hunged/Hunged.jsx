import React, { useState, useEffect, useContext } from 'react';
import AdminH from './AdminH';
import PlayerChallengeH from './PlayerChallengeH';
import OpponentInteractiveH from './OpponentInteractiveH';
import { RENDER_CHALLENGE } from '../../../utils/constants';
import socket from '../../../config/socket';
import { HungedContext } from '../../../context/challenges/GlobalContext';

const Hunged = ({renderIn}) => {

    const [secretWord, setSecretWord] = useState('');
    const [wordShowed, setWordShowed] = useState('');
    const [missedAttemps, setMissedAttemps] = useState(5);
    const [gameFinished, setGameFinished] = useState(false);
    const [render, setRender] = useState(null);

    useEffect(() => {
      if(localStorage.getItem('hunged-GG') != null){
          setSecretWord(JSON.parse(localStorage.getItem('hunged-GG')).secretWord);
          setWordShowed(JSON.parse(localStorage.getItem('hunged-GG')).wordShowed);
          setMissedAttemps(JSON.parse(localStorage.getItem('hunged-GG')).missedAttemps);
          setGameFinished(JSON.parse(localStorage.getItem('hunged-GG')).gameFinished);
      }     

    },[])


  useEffect(() => {

    socket.on('hunged', (dataHunged) => {
      if(dataHunged.sendedBy == RENDER_CHALLENGE.opponent){
        sendedByOpponent(dataHunged);
      }
      if(dataHunged.sendedBy == RENDER_CHALLENGE.player){
        sendedByPlayer(dataHunged);
      }
    });

    socket.on('notPassChallenge', (data) => {
      setGameFinished(true);
      setMissedAttemps(0);
    })

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminH/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeH secretWord={secretWord}/>)
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveH/>)
      break;
    } 

    localStorage.setItem('hunged-GG', JSON.stringify({secretWord, wordShowed, missedAttemps, gameFinished}));

  }, [renderIn, secretWord, wordShowed, missedAttemps, gameFinished]);

  const sendedByOpponent = (data) => {
    const secretWordModified = '_'.repeat(data.secretWord.length);
    const wordSplit = secretWordModified.split('').join(' ');
    setSecretWord(data.secretWord);
    setWordShowed(wordSplit);
  }

  const sendedByPlayer = (data) => {
    setWordShowed(data.wordShowed);
    setGameFinished(data.gameFinished);
    setMissedAttemps(data.missedAttemps);
  }

  return (
    <div>
      {renderIn != RENDER_CHALLENGE.opponent && 
       <div>
        {gameFinished ?
          <div>
            <p>{missedAttemps === 0 && wordShowed.includes('_') ? 'Perdiste. La palabra era:' : '¡Felicidades! Has ganado. La palabra era:'}</p>
            <p>{secretWord}</p>
          </div>
          : 
          <div>
            <h1>Juego del Ahorcado</h1>
            <p>Palabra: {wordShowed || 'Esperando palabra del oponente'}</p>
            <p>Intentos Restantes: {missedAttemps}</p>
          </div>
        }
       </div>        
      }
      {render}
    </div>
  );
};

export default Hunged;