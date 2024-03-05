import React, { useState, useEffect } from 'react';
import socket from '../../config/socket';

const Chronometer = ({data}) => {
  const [seconds, setSeconds] = useState(60);
  const [message, setMessage] = useState('');

  useEffect(() => {

    let interval = null;
    socket.on('startChallenge', (dataStart) => {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    });

    if(seconds == 0){
      clearInterval(interval);
      // Cuando el contador llega a cero, mostrar mensaje de juego perdido
      setMessage('No pasaste el reto, retornaras a la posicion anterior');
      setTimeout(() => {
        socket.emit('resultChallenge', {playerId: data.player.socketId, challengePassed: false});
      }, 1000);
    }

    return () => {
      socket.off('startChallenge');   
      setMessage('');   
    }

  }, [seconds]);

  return (
    <div>
      <h4>Tiempo restante para {data.player.teamName}: {seconds} segundos</h4>
      {message != '' && <p>{message}</p>}
    </div>
  );
};

export default Chronometer;