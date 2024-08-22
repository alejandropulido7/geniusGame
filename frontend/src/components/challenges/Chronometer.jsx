import React, { useState, useEffect } from 'react';
import socket from '../../config/socket';

const Chronometer = ({data}) => {
  const [seconds, setSeconds] = useState(60);
  const [message, setMessage] = useState('');
  const [showTime, setShowTime] = useState(true);


  useEffect(() => {
    if(localStorage.getItem('timeChallenge-GG') != null){
      const time = JSON.parse(localStorage.getItem('timeChallenge-GG'));
      setSeconds(prev => time.second??prev);
      setMessage(prev => time.message??prev);
      setShowTime(prev => time.showTime??prev);
    } 

  }, []);

  useEffect(() => {
    if(seconds >= 0){
      localStorage.setItem('timeChallenge-GG', JSON.stringify({seconds, message, showTime}));
    }
  }, [seconds, message, showTime]);

  useEffect(() => {
    let interval = null;
    socket.on('startChallenge', (dataStart) => {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    });

    socket.on('stopChallenge', (dataStop) => {
      clearInterval(interval);
    });

    if(seconds == 0){
      setShowTime(false);
      socket.emit('notPassChallenge', data.participants.player);
    }

    return () => {
      socket.off('startChallenge');   
      setMessage('');   
    }

  }, [seconds]);

  return (
    <div>
      {showTime ? <h4>Tiempo restante para {data.participants.player.teamName}: {seconds} segundos</h4> : <h4>Se acabo el tiempo, en espera de que el jugador del reto confirme desde su pantalla</h4>}
      {message != '' && <h4>{message}</h4>}
    </div>
  );
};

export default Chronometer;