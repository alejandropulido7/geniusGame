import React, { useState, useContext } from 'react'
import { SocketContext } from '../../../context/SocketProvider';

const PlayerChallengeW = ({word}) => {

    const [showButton, setShowButton] = useState(true);
    const {socket} = useContext(SocketContext);

    const emitResult = () => {
      setShowButton(false);
      if(socket){
        socket.emit('stopChallenge', {socketId: socket.id});
      }
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
            <div><button className='btn' onClick={emitResult}>Terminar</button></div>
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
