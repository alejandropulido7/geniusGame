import React, { useState } from 'react'
import HideWord from '../common/HideWord';
import socket from '../../../config/socket';

const PlayerChallengeA = ({word}) => {

    const [showButton, setShowButton] = useState(true);

    const emitResult = () => {
      setShowButton(false);
      socket.emit('stopChallenge', {socketId: socket.id});
    }
  
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
