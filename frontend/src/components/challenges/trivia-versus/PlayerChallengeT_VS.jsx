import React, {useEffect, useState, useContext, useRef} from 'react';
import {colorsApp, colorOptionsTrivia} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';

const PlayerChallengeT_VS = ({options, round, isRunning, setIsRunning, correctAnswer}) => {

  const {socket} = useContext(SocketContext);
  const [milliseconds, setMilliseconds] = useState(0);
  const intervalRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    console.log('options', options);
    if (isRunning) {
      setShowOptions(true);
      intervalRef.current = setInterval(() => {
        setMilliseconds(prevMilliseconds => prevMilliseconds + 1);
      }, 10);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, options, round]);

  const handleResponse = (response) => {
    setIsRunning(false);
    setShowOptions(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setMilliseconds(0); 
    socket?.emit('trivia', {function: 'versus', data: {response, correctAnswer, round, milliseconds, socketId: socket?.id}})
  };

  return (
    <>
      {options.length > 0 && showOptions
      ?
      <div>
        <div className="text-4xl font-mono">{Math.round(milliseconds/1000)} seg</div>
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
      :
      <div>
        <p>Esperando siguiente la pregunta...</p>
      </div>}
    </>
  )
}

export default PlayerChallengeT_VS
