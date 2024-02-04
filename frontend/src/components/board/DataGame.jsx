import React from 'react'

const DataGame = ({session, playersPositions, startGame}) => {

    const [gameStarted, setGameStarted] = useState(startGame);

    const readyToPlay = () => {
        setGameStarted(true);
        socket.emit('startGame');
      }

    return (
        <div>
            <div>
            <h4>{session.id}</h4>
            <p>Minutes to answer: {session.min_to_answer}</p>
            </div>
            { !gameStarted && <button onClick={readyToPlay}>Ready to play</button>}
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
