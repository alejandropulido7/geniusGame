import React, {useEffect, useState, useContext, useRef} from 'react'
import { SocketContext } from '../../../context/SocketProvider';
import { AudioContext } from '../../../context/AudioProvider';
import pass_challenge from '../../../assets/audio/pass_challenge.mp3';
import lose_challenge from '../../../assets/audio/lose-challenge.mp3';

const ValidateChallenge = () => {

    const [validOpponent, setValidOpponent] = useState(false);
    const [dataOpponent, setDataOpponent] = useState({});
    const {socket} = useContext(SocketContext);
    const {playSound} = useContext(AudioContext);
    const audioPassChallenge = useRef(new Audio(pass_challenge));
    const audioLoseChallenge = useRef(new Audio(lose_challenge));

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('validate-challenge-GG'));
      if(properties != null){
        setValidOpponent(properties.validOpponent);
        setDataOpponent(properties.dataOpponent);;
      } 
    },[]);

    useEffect(() => {
      localStorage.setItem('validate-challenge-GG', JSON.stringify({
        validOpponent,
        dataOpponent
      }));

    },[validOpponent,dataOpponent])

    useEffect(() => {
  
        if(socket){
          socket.on('stopChallenge', (dataStop) => {
            setValidOpponent(true);
            setDataOpponent(dataStop);
          });
    
          return () => {
            socket.off('stopChallenge');        
          }
        }
      },[socket, dataOpponent]);

    const sendResultChallenge = (result) => {
        setValidOpponent(false);
        if(result){
          playSound(audioPassChallenge, 1);
        } else {
          playSound(audioLoseChallenge, 1)
        }
        socket?.emit('resultChallenge', {player: dataOpponent, challengePassed: result});
      }

  return (
    <>
    {validOpponent && <div>
        <p>El equipo {dataOpponent.teamName} si logra pasar el reto?</p>
        <div className='flex justify-between my-5'>
          <button className='btn bg-green-600 text-white w-20' onClick={() => sendResultChallenge(true)}>SI</button>
          <button className='btn bg-red-600 text-white w-20' onClick={() => sendResultChallenge(false)}>NO</button>
        </div>
    </div>}
    </>
  )
}

export default ValidateChallenge
