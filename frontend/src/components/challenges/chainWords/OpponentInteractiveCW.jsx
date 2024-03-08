import React, { useContext, useState } from 'react'
import { ChainWordsContext } from '../../../context/challenges/ChallengeContext';
import socket from '../../../config/socket'

const OpponentInteractiveCW = () => {

    const [word, setWord] = useState('');
    const {lastWord, setLastWord} = useContext(ChainWordsContext)
  
    const emitWordChallenge = () => {
    //   socket.emit('actingAndWhistle', {word, wordReady: true, socketId: socket.id});
        setLastWord(word);
        socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { lastWord=='' && <div>
          <input type="text" placeholder='Type a word to your opponent' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={emitWordChallenge}>Sent word</button>
        </div>}
      </>
    )
  }

export default OpponentInteractiveCW
