import React, { useState, useEffect } from 'react'
import HideWord from '../common/HideWord';
import socket from '../../../config/socket';

const PlayerChallengeA = ({word}) => {

    const [showButton, setShowButton] = useState(true);

    const emitResult = () => {
      setShowButton(false);
      socket.emit('stopChallenge', {socketId: socket.id});
    }

    useEffect(() => {
      if(localStorage.getItem('acting-player-GG') != null){
          const properties = JSON.parse(localStorage.getItem('acting-player-GG'));
          setShowButton(prev => properties.showButton??prev);
      }
    },[])
  
    useEffect(() => {
      localStorage.setItem('acting-player-GG', JSON.stringify({showButton}));
    },[showButton])
  
    return (
      <div>
        { word == '' 
        ? 
        <div>
          <p>Esperando al oponente...</p>
        </div>
        : 
        <div>
          { showButton 
            ?
            <div><button onClick={emitResult}>Terminar</button></div>
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
