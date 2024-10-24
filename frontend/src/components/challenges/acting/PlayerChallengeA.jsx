import React, { useState, useEffect, useContext } from 'react'
import HideWord from '../common/HideWord';
import { SocketContext } from '../../../context/SocketProvider';
import ChallengeNotPassed from '../common/ChallengeNotPassed';

const PlayerChallengeA = ({word, teamPlayer}) => {

    const [showButton, setShowButton] = useState(true);
    const {socket} = useContext(SocketContext);
    const [gameFinished, setGameFinished] = useState(false);

    const emitResult = () => {
      setShowButton(false);
      socket?.emit('stopChallenge', {socketId: socket?.id});
    }

    useEffect(() => {
      if(localStorage.getItem('acting-player-GG') != null){
          const properties = JSON.parse(localStorage.getItem('acting-player-GG'));
          setShowButton(prev => properties.showButton??prev);
          setGameFinished(properties.gameFinished)
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('acting-player-GG', JSON.stringify({showButton, gameFinished}));
    },[showButton, gameFinished]);
  
    return (
      <div className='flex flex-col gap-6'>
        { word == '' 
        ? 
        <div>
          <p>Esperando al oponente...</p>
        </div>
        : 
        <div className='flex flex-col gap-6'>
          { showButton 
            ?
            <div>
              { !gameFinished && 
              <div>
                <p className='py-3'>El jugador <span className='text-red-600 underline uppercase'>{teamPlayer}</span> debe resolver este reto.</p>
                <button className='btn text-white shadow-md shadow-black bg-red-600' onClick={emitResult}>Terminar</button>
              </div>
              }
              <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={true}/>         
            </div>
            :
            <div>En proceso de revision...</div>
          } 
        </div>
        }
        <div>
          <HideWord word={word}/>
        </div>
        
      </div>
    )
  }

export default PlayerChallengeA
