import React, {useEffect, useState, useContext} from 'react';
import {colorsApp, colorOptionsTrivia} from '../../../utils/constants'
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

  return (
    <div>
      <div>
        <ul className='flex flex-col gap-2 justify-between'>
          {options.map((answerOption, index) => (
            <li 
              className='p-5 text-white rounded-md cursor-pointer'
              style={{backgroundColor: colorOptionsTrivia(index)}} 
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
