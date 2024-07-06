import React, { useState } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import HideWord from '../common/HideWord';
import socket from '../../../config/socket';

const OpponentInteractiveW = ({wordReady}) => {

    const [word, setWord] = useState('');
    const [finalWord, setFinalWord] = useState('');
  
    const emitWordChallenge = () => {
      setFinalWord(word);
      socket.emit('whistle', {word, wordReady: true, socketId: socket.id});
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady 
        ?
          <div>
            <input type="text" placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
            <button onClick={emitWordChallenge}>Sent word</button>
          </div>
        :
          <HideWord word={finalWord}/>  
        }
        <ValidateChallenge/>
      </>
    )
  }

export default OpponentInteractiveW
