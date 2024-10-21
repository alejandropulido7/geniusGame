import React, {useEffect, useState, useContext} from 'react'
import { SocketContext } from '../../../context/SocketProvider';

const ValidateChallenge = () => {

    const [validOpponent, setValidOpponent] = useState(false);
    const [dataOpponent, setDataOpponent] = useState({});
    const {socket} = useContext(SocketContext);

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
            console.log('dataStop', dataStop);
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
        socket?.emit('resultChallenge', {player: dataOpponent, challengePassed: result});
      }

  return (
    <>
    {validOpponent && <div>
        <p>El equipo {dataOpponent.teamName} si logra pasar el reto?</p>
        <div className='flex justify-around'>
          <button className='btn bg-green-600 text-white' onClick={() => sendResultChallenge(true)}>SI</button>
          <button className='btn bg-red-600 text-white' onClick={() => sendResultChallenge(false)}>NO</button>
        </div>
    </div>}
    </>
  )
}

export default ValidateChallenge
