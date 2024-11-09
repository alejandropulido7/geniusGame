import React, { useState, useContext, useEffect } from 'react'
import { SocketContext } from '../../../context/SocketProvider';
import ChallengeNotPassed from '../common/ChallengeNotPassed';
import HideWordPlayer from '../common/HideWordPlayer';

const PlayerChallengeW = ({word, teamPlayer}) => {

    const [showButton, setShowButton] = useState(true);
    const {socket} = useContext(SocketContext);
    const [gameFinished, setGameFinished] = useState(false);
    const [showFinishButton, setShowFinishButton] = useState(false);

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('whistle-player-GG'));
      if(properties != null){
          setShowButton(properties.showButton);
          setGameFinished(properties.gameFinished);
          setShowFinishButton(properties.showFinishButton);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('whistle-player-GG', JSON.stringify({showButton, gameFinished, showFinishButton}));
    },[showButton, gameFinished, showFinishButton]);

    const emitResult = () => {
      setShowButton(false);
      setGameFinished(true);
      if(socket){
        socket.emit('stopChallenge', {socketId: socket.id});
      }
    }
  
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

export default PlayerChallengeW
