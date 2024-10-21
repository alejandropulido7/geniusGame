import React, {useState, useEffect, useContext} from 'react'
import { SocketContext } from '../../../context/SocketProvider';
import { findFlagProperties } from '../../../utils/constants';

const ChallengeNotPassed = ({showButton, gameFinished, setGameFinished}) => {

    const [previousPosition, setPreviousPosition] = useState(0);
    const [dataPlayer, setDataPlayer] = useState(null);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('notPassedChallenge-GG'));
      if(properties != null){
          setPreviousPosition(properties.previousPosition);
          setDataPlayer(properties.dataPlayer);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('notPassedChallenge-GG', JSON.stringify({dataPlayer, previousPosition}));
    },[dataPlayer, previousPosition]);  

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
        {gameFinished && <div className='flex flex-col gap-2'>
            <p>Te se acabó el tiempo y no pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
            {showButton && <button className='btn text-white shadow-md shadow-black' style={{background: findFlagProperties(dataPlayer.flagActive).color}} onClick={() => resultChallenge(false)}>Entendido</button>}      
        </div>}
    </>
  )
}

export default ChallengeNotPassed
