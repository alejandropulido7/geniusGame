import React, {useState, useEffect} from 'react';
import socket from '../../config/socket';

const DataGame = ({session, playersPositions, startGame, setStartGame}) => {

    const readyToPlay = () => {
        setStartGame(true);
        socket.emit('startGame');
      }


    return (
        <div>
            <div>
            <h4>{session.id}</h4>
            <p>Minutes to answer: {session.min_to_answer}</p>
            </div>
            { !startGame && <button onClick={readyToPlay}>Ready to play</button>}
            <h1>Tablero de Escalera</h1>
            {
                playersPositions.map((player) => {
                    return (
                        <div key={player.teamName}>
                            <h3>{player.teamName} - {player.positionActive}</h3>
                        </div>
                    )
                })
            }      
        </div>
    )
}

export default DataGame
