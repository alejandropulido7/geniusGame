import React, {useEffect, useState} from 'react'
import socket from '../../config/socket';

const ValidateChallenge = () => {

    const [validOpponent, setValidOpponent] = useState(false);
    const [dataOpponent, setDataOpponent] = useState({});

    useEffect(() => {
  
        socket.on('stopChallenge', (dataStop) => {
          console.log('dataStop', dataStop);
          setValidOpponent(true);
          setDataOpponent(dataStop);
        });
  
        return () => {
          socket.off('stopChallenge');        
        }
      },[]);

    const sendResultChallenge = (result) => {
        socket.emit('resultChallenge', {playerId: dataOpponent.socketId, challengePassed: result});
      }

  return (
    <>
    {validOpponent && <div>
        <p>El equipo {dataOpponent.teamName} si logra pasar el reto?</p>
        <button onClick={() => sendResultChallenge(true)}>SI</button>
        <button onClick={() => sendResultChallenge(false)}>NO</button>
    </div>}
    </>
  )
}

export default ValidateChallenge
