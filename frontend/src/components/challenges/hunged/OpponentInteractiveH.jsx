import React, { useEffect, useState, useContext } from 'react'
import { RENDER_CHALLENGE } from '../../../utils/constants';
import HideWord from '../common/HideWord';
import { SocketContext } from '../../../context/SocketProvider';

const OpponentInteractiveH = () => {

    const [word, setWord] = useState('');
    const [wordReady, setWordReady] = useState(false);
    const {socket} = useContext(SocketContext);

    const validateWord = (text) => {
        setWord(text.trim());
    }

    const emitHungedChallenge = () => {
        setWordReady(true);
        socket?.emit('hunged', {secretWord: word, socketId: socket?.id, sendedBy: RENDER_CHALLENGE.opponent });
        socket?.emit('startChallenge', {socketId: socket?.id});
      }

    useEffect(() => {
        const properties = JSON.parse(localStorage.getItem('hunged-Opponet-GG'));
        if(properties != null){
            setWord(properties.word);
            setWordReady(properties.wordReady);
        }  
      },[])

    useEffect(() => {
        localStorage.setItem('hunged-Opponet-GG', JSON.stringify({word, wordReady}));
    },[word, wordReady])

    return (
        <>
            
            {!wordReady ? 
            <div>
                <input className='input' type="text" placeholder='Escribe una palabra' onChange={(e) => validateWord(e.target.value)}/>
                <button className='btn' onClick={emitHungedChallenge}>Enviar palabra</button>
            </div>
            : 
            <HideWord word={word}/>
            }
        </>
    )
}

export default OpponentInteractiveH
