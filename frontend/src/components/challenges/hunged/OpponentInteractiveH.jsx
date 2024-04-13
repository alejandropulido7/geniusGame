import React, { useState } from 'react'
import socket from '../../../config/socket';
import { RENDER_CHALLENGE } from '../../../utils/constants';

const OpponentInteractiveH = () => {

    const [word, setWord] = useState('');
    const [wordReady, setWordReady] = useState(false);
    const [showWord, setShowWord] = useState(false);

    const validateWord = (text) => {
        setWord(text.trim());
    }

    const emitHungedChallenge = () => {
        setWordReady(true);
        socket.emit('hunged', {secretWord: word, socketId: socket.id, sendedBy: RENDER_CHALLENGE.opponent });
        socket.emit('startChallenge', {socketId: socket.id});
      }

    const manageHold = () => {
        setShowWord(true);
    };

    const manageUnhold = () => {
        setShowWord(false);
    };

    return (
        <>
            {!wordReady ? 
            <div>
                <input type="text" placeholder='Escribe una palabra' onChange={(e) => validateWord(e.target.value)}/>
                <button onClick={emitHungedChallenge}>Enviar palabra</button>
            </div>
            : 
            <div>
                {showWord && <p>{word}</p>}
                <button
                    onMouseDown={manageHold}
                    onMouseUp={manageUnhold}
                    onTouchStart={manageHold}
                    onTouchEnd={manageUnhold}
                >
                Watch the word
                </button>
            </div>
            }
        </>
    )
}

export default OpponentInteractiveH
