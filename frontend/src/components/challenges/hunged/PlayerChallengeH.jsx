import React, {useContext, useEffect, useState} from 'react'
import { RENDER_CHALLENGE } from '../../../utils/constants';
import { getTeamByName } from '../../../services/teamService';
import { useParams } from 'react-router-dom';
import { getCookie } from '../../../utils/cookies';
import { SocketContext } from '../../../context/SocketProvider';


const PlayerChallengeH = ({secretWord, player}) => {

    const [wordShowed, setWordShowed] = useState('');
    const [missedAttemps, setMissedAttemps] = useState(5);
    const [lettersGuessed, setLettersGuessed] = useState([]);
    const [gameFinished, setGameFinished] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [showNotPassChallenge, setShowNotPassChallenge] = useState(false);
    const [previousPosition, setPreviousPosition] = useState(0);
    const {idRoom} = useParams();
    const [dataPlayer, setDataPlayer] = useState(null);
    const {socket} = useContext(SocketContext);


    useEffect(() => {
        const properties = JSON.parse(localStorage.getItem('hunged-pl-GG'));
        if(properties != null){
              setWordShowed(properties.wordShowed);
              setMissedAttemps(properties.missedAttemps);
              setLettersGuessed(properties.lettersGuessed);
              setGameFinished(properties.gameFinished);
              setShowKeyboard(properties.showKeyboard);
              setShowNotPassChallenge(properties.showNotPassChallenge);
              setPreviousPosition(properties.previousPosition);
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

            if(socket){
                socket.emit('hunged', {gameFinished: gameFinishedCopy,
                    wordShowed: newWordShowed, 
                    missedAttemps: attempsUpdate,
                    socketId: socket.id, 
                    sendedBy: RENDER_CHALLENGE.player });
                if(gameFinishedCopy) {
                    socket.emit('stopChallenge', {socketId: socket.id});
                }
            }
        }
      };

    useEffect(() => {
        setDataPlayer(player);
        if(socket){
            socket.on('notPassChallenge', (data) => {
                if(data.socketId == socket.id){
                  setShowNotPassChallenge(true);
                  setShowKeyboard(false);
                  setDataPlayer(data);
                  setPreviousPosition(data.prev_position);
                }
              })
        }
    }, [socket, player]);


    const resultChallenge = (passChallenge) => {
        socket?.emit('resultChallenge', {player: dataPlayer, challengePassed: passChallenge});
    }

    return (
        <div>
            <div className='flex flex-row flex-wrap gap-1 justify-center'>
            {(!gameFinished && secretWord && showKeyboard) &&
                'abcdefghijklmnopqrstuvwxyz'.split('').map((letra) => (
                <button className='p-2 w-10 bg-white border-2 rounded-md border-gray-700 disabled:bg-black disabled:text-white hover:text-white hover:bg-black touch-manipulation text-black my-2' 
                    style={{fontFamily: 'verdana'}}
                    key={letra} onClick={() => manejarIntento(letra)} disabled={lettersGuessed.includes(letra)}>
                    {letra}
                </button>
            ))}
            </div>
            {gameFinished && 
            <div>
                <button className='btn' onClick={() => resultChallenge(true)}>Terminar</button>
            </div>}
            {showNotPassChallenge && 
            <div>
                <p>No pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
                <button className='btn' onClick={() => resultChallenge(false)}>OK</button>
            </div>
            }
        </div>
    )
}

export default PlayerChallengeH
