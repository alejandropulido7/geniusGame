import React, {useState, useEffect} from 'react';
import socket from '../../config/socket';

const DataGame = ({session, playersPositions, startGame, setStartGame}) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [activeStartGame, setActiveStartGame] = useState(false);

    const readyToPlay = () => {
        setErrorMessage('');
        if(playersPositions.length > 1){
            setStartGame(true);
            socket.emit('startGame', session.id);
        } else {
            setErrorMessage('No hay suficientes equipos para jugar (min. 2)')
        }
      }

    useEffect(() => {
        if(playersPositions.length > 1){
            setActiveStartGame(true);
        }
    }, [playersPositions]);


    return (
        <div>
            <div>
            <h4>{session.id}</h4>
            <p>Minutes to answer: {session.min_to_answer}</p>
            </div>
            { !startGame && activeStartGame && <button className='btn' onClick={readyToPlay}>Ready to play</button>}
            <h1 className='text-red-600 text-3xl font-bold underline'>Tablero de Escalera</h1>
            {
                playersPositions.map((player) => {
                    return (
                        <div key={player.teamName}>
                            <h3>{player.teamName} - {player.positionActive}</h3>
                        </div>
                    )
                })
            }
            {errorMessage && <p>{errorMessage}</p>}  
        </div>
    )
}

export default DataGame
