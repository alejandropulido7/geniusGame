import React, { useEffect, useState } from 'react';
import {colorsApp} from '../../../utils/constants';

const AdminT = ({category, currentQuestion, options}) => {

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
              style={{backgroundColor: colorOptions(index), width: '45%'}} 
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
