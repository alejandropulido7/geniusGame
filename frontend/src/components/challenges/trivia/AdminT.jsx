import React, { useEffect, useState } from 'react';
import {colorOptionsTrivia} from '../../../utils/constants';
import ChallengeNotPassed from '../common/ChallengeNotPassed';

const AdminT = ({category, currentQuestion, options}) => {

  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {

  },[category, currentQuestion, options])

  return (
    <div>
      <div>
        {!gameFinished && 
          <div>
            <div className='p-5 bg-black text-white'>
              <p>{category}</p>
            </div>
            <div className='my-5'>
              <p className='p-8 bg-gray-300 border-2 rounded-md md:text-2xl text-xl'>Pregunta: {currentQuestion}</p>
            </div> 
            <div>
              {options.length > 0 && 
              <ul className='flex flex-wrap gap-2 justify-between'>
                {options.map((answerOption, index) => (
                  <li 
                    className='p-5 text-white rounded-md cursor-pointer'
                    style={{backgroundColor: colorOptionsTrivia(index), width: '45%'}} 
                    key={index} >
                    {answerOption}
                  </li>
                ))}
              </ul> 
              }
            </div>
          </div>
        }
        <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={false}/>
      </div>
    </div>
  )
}

export default AdminT
