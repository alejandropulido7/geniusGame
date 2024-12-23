import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/SocketProvider';
import { GlobalContext } from '../../context/GlobalContext';
import { HUNGED, WORD_CHAIN } from '../../utils/constants';
import { AudioContext } from '../../context/AudioProvider';


const Chronometer = ({data}) => {
  const [seconds, setSeconds] = useState(60*data.min_to_answer);
  const [message, setMessage] = useState('');
  const [showTime, setShowTime] = useState(true);
  const [player, setPlayer] = useState(null);
  const {socket} = useContext(SocketContext);
  const {dataChallenge} = useContext(GlobalContext);
  const {audioRefLoseChallenge, audioRefTime, playSound, stopSound} = useContext(AudioContext);
  const [lastSeconds, setLastSeconds] = useState(false)

  useEffect(() => {
    const time = JSON.parse(localStorage.getItem('timeChallenge-GG'));
    if(time != null){
      setSeconds(time.second);
      setMessage(time.message);
      setShowTime(time.showTime);
      setPlayer(time.player);
    } 
  }, []);

  useEffect(() => {
    if(seconds >= 0){
      localStorage.setItem('timeChallenge-GG', JSON.stringify({seconds, message, showTime, player}));
    }
  }, [seconds, message, showTime, player]);

  useEffect(() => {

    let interval = null;
    socket?.on('startChallenge', (dataPlayer) => {
      setPlayer(dataPlayer);
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    });

    socket?.on('restartTime', (dataStop) => {
      setSeconds(30);
    });

    socket?.on('stopChallenge', (dataStop) => {
      clearInterval(interval);
    });

    if(seconds > 0 && seconds <= 10){
      setLastSeconds(true)
      playSound(audioRefTime, 1);
    }

    if(seconds == 0){
      clearInterval(interval);
      playSound(audioRefLoseChallenge, 0.6);
      setShowTime(false);
      socket?.emit('notPassChallenge', data.participants.player);
    }

    return () => {   
      setMessage('');   
    }

  }, [seconds, socket]);

  return (
    <div className='bg-white text-xl rounded-md'>
      {showTime ? 
      <h4 className={lastSeconds ? 'text-red-600' : 'text-black'}>Tiempo restante: {seconds} segundos</h4> : 
      <h4 className='text-indigo-500'>Se acabo el tiempo, en espera de que el jugador del reto confirme desde su pantalla</h4>}
      {message != '' && <h4>{message}</h4>}
    </div>
  );
};

export default Chronometer;