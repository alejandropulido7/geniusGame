import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Confetti from 'react-confetti'


const Winner = ({winner}) => {
    const navigate = useNavigate();

    const finishGame = () => {
        navigate('../room');
    }

  return (
    <div className='flex flex-col justify-between gap-5'>
        <Confetti/>
        <h1>El ganador es: {winner.teamName}</h1>
        <button onClick={finishGame} className='btn my-5 text-white bg-black shadow-sm shadow-white'>Ir al inicio</button>
    </div>
  )
}

export default Winner
