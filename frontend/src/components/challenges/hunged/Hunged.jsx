import React, { useState, useEffect, useContext } from 'react';
import AdminH from './AdminH';
import PlayerChallengeH from './PlayerChallengeH';
import OpponentInteractiveH from './OpponentInteractiveH';
import { RENDER_CHALLENGE } from '../../../utils/constants';
import { SocketContext } from '../../../context/SocketProvider';

const Hunged = ({renderIn, dataPlayer}) => {

    const [secretWord, setSecretWord] = useState('');
    const [wordShowed, setWordShowed] = useState('');
    const [missedAttemps, setMissedAttemps] = useState(5);
    const [gameFinished, setGameFinished] = useState(false);
    const [render, setRender] = useState(null);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('hunged-GG'));
      if(properties != null){
          setSecretWord(properties.secretWord);
          setWordShowed(properties.wordShowed);
          setMissedAttemps(properties.missedAttemps);
          setGameFinished(properties.gameFinished);
      }
    },[])


  useEffect(() => {

    socket?.on('hunged', (dataHunged) => {
      if(dataHunged.sendedBy == RENDER_CHALLENGE.opponent){
        sendedByOpponent(dataHunged);
      }
      if(dataHunged.sendedBy == RENDER_CHALLENGE.player){
        sendedByPlayer(dataHunged);
      }
    });

    socket?.on('notPassChallenge', (data) => {
      setGameFinished(true);
      setMissedAttemps(0);
    })

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminH/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeH secretWord={secretWord} player={dataPlayer}/>)
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveH/>)
      break;
    } 

    localStorage.setItem('hunged-GG', JSON.stringify({secretWord, wordShowed, missedAttemps, gameFinished}));

  }, [socket, renderIn, secretWord, wordShowed, missedAttemps, gameFinished, dataPlayer]);

  const sendedByOpponent = (data) => {
    const secretWordModified = '_'.repeat(data.secretWord.length);
    const wordSplit = secretWordModified.split('').join(' ');
    setSecretWord(data.secretWord.toLowerCase());
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
          <div className='text-xl'>
            <p>{missedAttemps === 0 && wordShowed.includes('_') ? 'Perdiste. La palabra era:' : '¡Felicidades! Has ganado. La palabra era:'}</p>
            <p>{secretWord}</p>
          </div>
          : 
          <div className='flex flex-col gap-5'>
            <h1 className='m-auto text-2xl title-wood p-5 text-white'>Juego del Ahorcado</h1>
            <div>
              <p>Palabra: </p>
              <p>{wordShowed || 'Esperando palabra del oponente'}</p>
            </div>
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