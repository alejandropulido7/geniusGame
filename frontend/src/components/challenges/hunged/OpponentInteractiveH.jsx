import React, { useEffect, useState, useContext } from 'react'
import { RENDER_CHALLENGE } from '../../../utils/constants';
import HideWord from '../common/HideWord';
import { SocketContext } from '../../../context/SocketProvider';

const OpponentInteractiveH = () => {

    const [word, setWord] = useState('');
    const [wordReady, setWordReady] = useState(false);
    const {socket} = useContext(SocketContext);
    const [errorMessage, setErrorMessage] = useState('');

    const validateWord = (text) => {
        setWord(text.trim());
    }

    const emitHungedChallenge = () => {
        if(word == ''){
            setErrorMessage('No has escrito una palabra');
        } else {
            setErrorMessage('');
            setWordReady(true);
            socket?.emit('hunged', {secretWord: word, socketId: socket?.id, sendedBy: RENDER_CHALLENGE.opponent });
            socket?.emit('startChallenge', {socketId: socket?.id});
        }
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
            <div className='flex flex-col gap-4'>
                <p>Envia una palabra para el equipo contrario</p>
                <textarea rows={2} className='input' type="text" placeholder='Escribe una palabra' value={word} onChange={(e) => validateWord(e.target.value)}/>
                <button className='btn-wood py-2 text-white' onClick={emitHungedChallenge}>Enviar palabra</button>
                {errorMessage != '' && <p className='text-red-600'>{errorMessage}</p>}
            </div>
            : 
            <HideWord word={word}/>
            }
        </>
    )
}

export default OpponentInteractiveH
