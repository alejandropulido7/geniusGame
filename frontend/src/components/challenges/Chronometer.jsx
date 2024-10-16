import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/SocketProvider';


const Chronometer = ({data}) => {
  const [seconds, setSeconds] = useState(60);
  const [message, setMessage] = useState('');
  const [showTime, setShowTime] = useState(true);
  const [player, setPlayer] = useState(null);
  const {socket} = useContext(SocketContext);

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
    socket?.on('startChallenge', (dataPlayer) => {
      console.log("dataPlayer-CRONO", dataPlayer);
      setPlayer(dataPlayer);
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    });

    socket?.on('stopChallenge', (dataStop) => {
      clearInterval(interval);
    });

    if(seconds == 0){
      setShowTime(false);
      // socket?.emit('notPassChallenge', data.participants.player);
    }

    return () => {   
      setMessage('');   
    }

  }, [seconds, data, socket]);

  return (
    <div className='bg-white text-xl rounded-md'>
      {showTime ? <h4>Tiempo restante: {seconds} segundos</h4> : <h4>Se acabo el tiempo, en espera de que el jugador del reto confirme desde su pantalla</h4>}
      {message != '' && <h4>{message}</h4>}
    </div>
  );
};

export default Chronometer;