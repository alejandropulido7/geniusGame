import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';


const Winner = ({winner}) => {
    const navigate = useNavigate();

    const finishGame = () => {
        navigate('../room');
    }

  return (
    <div>
        <h1>El ganador es: {winner.teamName}</h1>
        <button onClick={finishGame} className='btn'>Ir al inicio</button>
    </div>
  )
}

export default Winner
