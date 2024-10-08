import React, { useEffect, useState } from 'react';
import {colorsApp, colorOptionsTrivia} from '../../../utils/constants';

const AdminT = ({category, currentQuestion, options}) => {

  return (
    <div>
      <div className='p-5 bg-black text-white'>
        <p>{category}</p>
      </div>
      <div className='my-5'>
        <p className='p-8 bg-gray-300 border-2 rounded-md'>Pregunta: {currentQuestion}</p>
      </div> 
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
      </div>       
    </div>
  )
}

export default AdminT
