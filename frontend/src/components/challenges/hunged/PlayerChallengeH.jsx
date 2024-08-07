import React, {useContext, useEffect, useState} from 'react'
import { HungedContext } from '../../../context/challenges/GlobalContext';
import socket from '../../../config/socket';
import { RENDER_CHALLENGE } from '../../../utils/constants';
import { getTeamByName } from '../../../services/teamService';
import { useParams } from 'react-router-dom';
import { getCookie } from '../../../utils/cookies';


const PlayerChallengeH = ({secretWord}) => {

    const [wordShowed, setWordShowed] = useState('');
    const [missedAttemps, setMissedAttemps] = useState(5);
    const [lettersGuessed, setLettersGuessed] = useState([]);
    const [gameFinished, setGameFinished] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [showNotPassChallenge, setShowNotPassChallenge] = useState(false);
    const [previousPosition, setPreviousPosition] = useState(0);
    const {idRoom} = useParams();

    useEffect(() => {
        if(localStorage.getItem('hunged-pl-GG') != null){
              setWordShowed(JSON.parse(localStorage.getItem('hunged-pl-GG')).wordShowed);
              setMissedAttemps(JSON.parse(localStorage.getItem('hunged-pl-GG')).missedAttemps);
              setLettersGuessed(JSON.parse(localStorage.getItem('hunged-pl-GG')).lettersGuessed);
              setGameFinished(JSON.parse(localStorage.getItem('hunged-pl-GG')).gameFinished);
              setShowKeyboard(JSON.parse(localStorage.getItem('hunged-pl-GG')).showKeyboard);
              setShowNotPassChallenge(JSON.parse(localStorage.getItem('hunged-pl-GG')).showNotPassChallenge);
              setPreviousPosition(JSON.parse(localStorage.getItem('hunged-pl-GG')).previousPosition);
        }     

    },[])
  
      useEffect(() => {
        localStorage.setItem('hunged-pl-GG', JSON.stringify({
            wordShowed,
            missedAttemps,
            lettersGuessed,
            gameFinished,
            showKeyboard,
            showNotPassChallenge,
            previousPosition}));
  
      },[wordShowed,
        missedAttemps,
        lettersGuessed,
        gameFinished,
        showKeyboard,
        showNotPassChallenge,
        previousPosition])

    const manejarIntento = (letra) => {
        if (!gameFinished && !lettersGuessed.includes(letra)) {

            let attempsUpdate = missedAttemps;
            let gameFinishedCopy = gameFinished;

            if (!secretWord.includes(letra)) {
                attempsUpdate = attempsUpdate - 1;
                setMissedAttemps(attempsUpdate);
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
                gameFinishedCopy = true;
            }
    
            if (attempsUpdate === 0) {
                getTeamByName(getCookie('teamName-GG'), idRoom)
                .then((data) => {
                    setPreviousPosition(data.prev_position);
                })
                setShowNotPassChallenge(true);
                setShowKeyboard(false);
                gameFinishedCopy = true;
            }

            socket.emit('hunged', {gameFinished: gameFinishedCopy,
                wordShowed: newWordShowed, 
                missedAttemps: attempsUpdate,
                socketId: socket.id, 
                sendedBy: RENDER_CHALLENGE.player });
            if(gameFinishedCopy) {
                socket.emit('stopChallenge', {socketId: socket.id});
            }
        }
      };

    useEffect(() => {
        
        socket.on('notPassChallenge', (data) => {
            if(data.socketId == socket.id){
              setShowNotPassChallenge(true);
              setShowKeyboard(false);
              setPreviousPosition(data.prev_position);
            }
          })
    }, []);


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
