import React, { useEffect, useState } from 'react'
import socket from '../../../config/socket';
import { RENDER_CHALLENGE } from '../../../utils/constants';
import HideWord from '../common/HideWord';

const OpponentInteractiveH = () => {

    const [word, setWord] = useState('');
    const [wordReady, setWordReady] = useState(false);

    const validateWord = (text) => {
        setWord(text.trim());
    }

    const emitHungedChallenge = () => {
        setWordReady(true);
        socket.emit('hunged', {secretWord: word, socketId: socket.id, sendedBy: RENDER_CHALLENGE.opponent });
        socket.emit('startChallenge', {socketId: socket.id});
      }

    useEffect(() => {
        if(localStorage.getItem('hunged-Opponet-GG') != null){
            setWord(JSON.parse(localStorage.getItem('hunged-Opponet-GG')).word);
            setWordReady(JSON.parse(localStorage.getItem('hunged-Opponet-GG')).wordReady);
        }     
  
      },[])

    useEffect(() => {
        localStorage.setItem('hunged-Opponet-GG', JSON.stringify({word, wordReady}));
    },[word, wordReady])

    return (
        <>
            
            {!wordReady ? 
            <div>
                <input type="text" placeholder='Escribe una palabra' onChange={(e) => validateWord(e.target.value)}/>
                <button onClick={emitHungedChallenge}>Enviar palabra</button>
            </div>
            : 
            <HideWord word={word}/>
            }
        </>
    )
}

export default OpponentInteractiveH
