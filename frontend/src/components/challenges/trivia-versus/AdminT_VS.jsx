import React, { useEffect, useState } from 'react';
import {colorsApp, colorOptionsTrivia} from '../../../utils/constants';
import PositionsTable from './PositionsTable';

const AdminT_VS = ({category, currentQuestion, options, scorePlayers}) => {

  useEffect(() => {

  }, [options, category, currentQuestion]);

  return (
    <div>
      {scorePlayers.length > 0 && 
      <div>
        <PositionsTable positionTable={scorePlayers}/>
      </div>}
      <div className='p-5 bg-black text-white'>
        <p>{category}</p>
      </div>
      <div className='my-5'>
        <p className='p-8 bg-gray-300 border-2 rounded-md'>Pregunta: {currentQuestion}</p>
      </div> 
      {options.length > 0 &&
      <div>
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
      </div> }      
    </div>
  )
}

export default AdminT_VS
