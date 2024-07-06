import React, { useState } from 'react'
import socket from '../../../config/socket';

const PlayerChallengeW = ({word}) => {

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

export default PlayerChallengeW
