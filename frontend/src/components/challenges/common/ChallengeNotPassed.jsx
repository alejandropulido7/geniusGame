import React, {useState} from 'react'
import socket from '../../../config/socket';

const ChallengeNotPassed = ({showButton, gameFinished, setGameFinished}) => {

    const [previousPosition, setPreviousPosition] = useState(0);

    useEffect(() => {
        
        socket.on('notPassChallenge', (data) => {
            setGameFinished(true);
            setPreviousPosition(data.prev_position);
          })
    }, []);

    const resultChallenge = (passChallenge) => {
        socket.emit('resultChallenge', {playerId: socket.id, challengePassed: passChallenge});
    }

  return (
    <>
        {gameFinished && <div>
            <p>No pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
            {showButton && <button onClick={() => resultChallenge(false)}>OK</button>}      
        </div>}
    </>
  )
}

export default ChallengeNotPassed
