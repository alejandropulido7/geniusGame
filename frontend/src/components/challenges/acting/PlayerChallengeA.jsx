import React, { useState, useEffect, useContext } from 'react'
import HideWord from '../common/HideWord';
import { SocketContext } from '../../../context/SocketProvider';
import ChallengeNotPassed from '../common/ChallengeNotPassed';
import HideWordPlayer from '../common/HideWordPlayer';

const PlayerChallengeA = ({word, teamPlayer}) => {

    const [showButton, setShowButton] = useState(true);
    const {socket} = useContext(SocketContext);
    const [gameFinished, setGameFinished] = useState(false);
    const [showFinishButton, setShowFinishButton] = useState(false);

    const emitResult = () => {
      setShowButton(false);
      setGameFinished(true);
      socket?.emit('stopChallenge', {socketId: socket?.id});
    }

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('acting-player-GG'));
      if(properties != null){
          setShowButton(properties.showButton);
          setGameFinished(properties.gameFinished);
          setShowFinishButton(properties.showFinishButton);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('acting-player-GG', JSON.stringify({showButton, gameFinished, showFinishButton}));
    },[showButton, gameFinished, showFinishButton]);
  
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
          <HideWordPlayer word={word} gameFinished={gameFinished} setShowFinishButton={setShowFinishButton}/>
        </div>
        { (word != '' && !gameFinished && showFinishButton) &&           
        <div className='mt-10'>
          <button className='btn text-white shadow-md shadow-black bg-red-600' onClick={emitResult}>Terminar</button>
        </div>
        }
      </div>
    )
  }

export default PlayerChallengeA
