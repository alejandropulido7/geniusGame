import React, { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../../../context/SocketProvider';
import { AudioContext } from '../../../context/AudioProvider';
import show_word_audio from '../../../assets/audio/show_word.mp3'

const HideWordPlayer = ({word, gameFinished, setShowFinishButton}) => {

    const [showWord, setShowWord] = useState(false);
    const [textButton, setTextButton] = useState('Ver la palabra secreta y empezar el reto');
    const [startChallenge, setStartChallenge] = useState(false);
    const {socket} = useContext(SocketContext);
    const {playSound} = useContext(AudioContext);
    const audioShowWord = useRef(new Audio(show_word_audio));

    useEffect(() => {
        const properties = localStorage.getItem('hideWord-GG');
        if(properties != null){
            setTextButton(properties.textButton);
            setStartChallenge(properties.startChallenge);
        }
      },[]);
    
      useEffect(() => {
        localStorage.setItem('hideWord-GG', JSON.stringify({textButton, startChallenge}));
      },[textButton, startChallenge, word, gameFinished]); 

    const manageHold = () => {
        setShowWord(true);
    };

    const manageUnhold = () => {
        setShowWord(false);
    };

    const manageUnholdStart = () => {
        playSound(audioShowWord, 1);
        setStartChallenge(true)
        socket?.emit('startChallenge', {socketId: socket?.id});
        setShowFinishButton(true);
        setTextButton('Ver palabra secreta');
        setShowWord(false);
    };

  return (
    <div className='flex flex-col'>        
        { word != '' &&      
        <div className='order-2'>
            <button
                className='btn-wood py-2 px-6 text-white'
                onMouseDown={manageHold}
                onMouseUp={!startChallenge ? manageUnholdStart : manageUnhold}
                onTouchStart={manageHold}
                onTouchEnd={!startChallenge ? manageUnholdStart : manageUnhold}
            >
            {textButton}
            </button>
        </div>
        }
        <div className='order-1 py-2'>
            {showWord && <p>{word}</p>}
        </div>
        { (!startChallenge && word != '' && !gameFinished) && 
            <div className='mt-10 order-3'>
                <p className='text-2xl text-indigo-600'>PREPARATE!</p>
                <p>Despues de ver la palabra o frase, empieza a correr el tiempo</p>
            </div>
        }
    </div>
  )
}

export default HideWordPlayer
