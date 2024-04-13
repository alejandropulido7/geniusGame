import React, {useContext, useEffect, useState} from 'react'
import { HungedContext } from '../../../context/challenges/GlobalContext';
import socket from '../../../config/socket';
import { RENDER_CHALLENGE } from '../../../utils/constants';

const PlayerChallengeH = ({secretWord}) => {

    const [wordShowed, setWordShowed] = useState('');
    const [missedAttemps, setMissedAttemps] = useState(5);
    const [lettersGuessed, setLettersGuessed] = useState([]);
    const [gameFinished, setGameFinished] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [showNotPassChallenge, setShowNotPassChallenge] = useState(false);
    const [previousPosition, setPreviousPosition] = useState(0);
    
    // const {secretWord, 
    //     setWordShowed, 
    //     missedAttemps, setMissedAttemps, 
    //     lettersGuessed, setLettersGuessed, 
    //     gameFinished, setGameFinished} = useContext(HungedContext);

    const manejarIntento = (letra) => {
        if (!gameFinished && !lettersGuessed.includes(letra)) {
            
            if (!secretWord.includes(letra)) {
                setMissedAttemps((prevIntentos) => prevIntentos - 1);
            }
            const lettersGuessedCopy = [...lettersGuessed];
            lettersGuessedCopy.push(letra);
            setLettersGuessed(lettersGuessedCopy);
    
            const newWordShowed = secretWord
                .split('')
                .map((char) => (lettersGuessedCopy.includes(char) ? char : '_'))
                .join(' ');
    
            setWordShowed(newWordShowed);
    
            if (!newWordShowed.includes('_')) {
                setGameFinished(true);
            }
    
            if (missedAttemps === 0) {
                setGameFinished(true);
            }
        }
      };

    useEffect(() => {
        socket.emit('hunged', {gameFinished,
            wordShowed, 
            missedAttemps,
            socketId: socket.id, 
            sendedBy: RENDER_CHALLENGE.player });
        if(gameFinished) {
            socket.emit('stopChallenge', {socketId: socket.id});
        }

        socket.on('notPassChallenge', (data) => {
            if(data.socketId == socket.id){
              setShowNotPassChallenge(true);
              setShowKeyboard(false);
              setPreviousPosition(data.prev_position);
            }
          })
    }, [gameFinished, wordShowed, missedAttemps]);


    const resultChallenge = (passChallenge) => {
        socket.emit('resultChallenge', {playerId: socket.id, challengePassed: passChallenge});
    }

    return (
        <div>
            {(!gameFinished && secretWord && showKeyboard) &&
                'abcdefghijklmnopqrstuvwxyz'.split('').map((letra) => (
                <button key={letra} onClick={() => manejarIntento(letra)} disabled={lettersGuessed.includes(letra)}>
                    {letra}
                </button>
            ))}
            {gameFinished && 
            <div>
                <button onClick={() => resultChallenge(true)}>Terminar</button>
            </div>}
            {showNotPassChallenge && 
            <div>
                <p>No pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
                <button onClick={() => resultChallenge(false)}>OK</button>
            </div>
            }
        </div>
    )
}

export default PlayerChallengeH
