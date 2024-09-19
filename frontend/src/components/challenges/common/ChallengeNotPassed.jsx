import React, {useState, useEffect, useContext} from 'react'
import { SocketContext } from '../../../context/SocketProvider';

const ChallengeNotPassed = ({showButton, gameFinished, setGameFinished}) => {

    const [previousPosition, setPreviousPosition] = useState(0);
    const [dataPlayer, setDataPlayer] = useState(null);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
        
        socket?.on('notPassChallenge', (data) => {
            console.log("ChallengeNotPassed", data);
            setGameFinished(true);
            setDataPlayer(data);
            setPreviousPosition(data.prev_position);
          })
    }, [socket, previousPosition]);

    const resultChallenge = (passChallenge) => {
        socket?.emit('resultChallenge', {player: dataPlayer, challengePassed: passChallenge});
    }

  return (
    <>
        {gameFinished && <div>
            <p>No pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
            {showButton && <button className='btn' onClick={() => resultChallenge(false)}>OK</button>}      
        </div>}
    </>
  )
}

export default ChallengeNotPassed
