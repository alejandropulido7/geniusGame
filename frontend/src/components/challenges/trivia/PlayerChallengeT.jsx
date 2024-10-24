import React, {useEffect, useState, useContext} from 'react';
import {colorOptionsTrivia} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';
import ChallengeNotPassed from '../common/ChallengeNotPassed';

const PlayerChallengeT = ({options, correctAnswer}) => {

  const {socket} = useContext(SocketContext);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {  
    const triviaStarted = localStorage.getItem('triviaStarted');
    if (!triviaStarted) {
      localStorage.setItem('triviaStarted', 'true');
      socket?.emit('startChallenge', {socketId: socket?.id});
    }
  },[options, correctAnswer])

  const handleResponse = (response) => {
    socket?.emit('stopChallenge', {socketId: socket?.id});
    socket?.emit('trivia', {function: 'regular', data: {response, socketId: socket?.id}})
  };

  return (
    <div className='my-5'>
      {!gameFinished && 
        <div>
          {options.length > 0 && 
          <div className='flex flex-col gap-5'>
            <p>Mira la pregunta en la pantalla</p>
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
          }
        </div>
      }
      <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={true}/>
    </div>
  )
}

export default PlayerChallengeT
