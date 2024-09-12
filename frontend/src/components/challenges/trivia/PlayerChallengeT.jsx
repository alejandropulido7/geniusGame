import React, {useEffect, useState} from 'react';
import socket from '../../../config/socket';
import { getCookie } from '../../../utils/cookies';
import {colorsApp} from '../../../utils/constants'

const PlayerChallengeT = ({options, correctAnswer}) => {

  const [openModal, setOpenModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState('');
  const [buttonModal, setButtonModal] = useState('');
  const [passChallenge, setPassChallenge] = useState(false);

  useEffect(() => {
    socket.emit('startChallenge', {socketId: socket.id});
  },[options, correctAnswer])

  const manejarRespuesta = (response) => {
    socket.emit('trivia', {function: 'regular', data: {response, socketId: socket.id}})
  };

  const colorOptions = (index) => {
    switch (index) {
      case 0:        
        return colorsApp.get('purple').color;
      case 1:        
        return colorsApp.get('red').color;
      case 2:        
        return colorsApp.get('green').color;
      case 3:        
        return colorsApp.get('blue').color;
      default:
        break;
    }
  }

  return (
    <div>
      <div>
        <ul className='flex flex-col gap-2 justify-between'>
          {options.map((answerOption, index) => (
            <li 
              className='p-5 text-white rounded-md cursor-pointer'
              style={{backgroundColor: colorOptions(index)}} 
              key={index} 
              onClick={() => manejarRespuesta(answerOption)}>
              {answerOption}
            </li>
          ))}
        </ul> 
      </div>
    </div>
  )
}

export default PlayerChallengeT
