import React, {useEffect, useState, useContext} from 'react';
import {colorsApp} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';

const PlayerChallengeT = ({options, correctAnswer}) => {

  const {socket} = useContext(SocketContext);

  useEffect(() => {  
    const triviaStarted = localStorage.getItem('triviaStarted');
    if (!triviaStarted) {
      localStorage.setItem('triviaStarted', 'true');
      socket?.emit('startChallenge', {socketId: socket?.id});
    }
  },[options, correctAnswer])

  const handleResponse = (response) => {
    socket?.emit('trivia', {function: 'regular', data: {response, socketId: socket?.id}})
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
              onClick={() => handleResponse(answerOption)}>
              {answerOption}
            </li>
          ))}
        </ul> 
      </div>
    </div>
  )
}

export default PlayerChallengeT
