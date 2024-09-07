import React, {useState, useEffect} from 'react'
import {FLAGS, findFlagProperties} from '../../utils/constants'
import Box from './Box';
import Flag from './Flag';

const StepsBoard = ({arrayPositions, flag, players, stlyeClass}) => {

  const [posicionJugador, setPosicionJugador] = useState(1);
  
  const colorFlag = () => {
    return findFlagProperties(flag);
  }


  return (
    <>
      <div className={`${stlyeClass} flex flex-wrap my-5 p-7 rounded-md overflow-visible`}>
          {arrayPositions.map((position, index) => (
            <div key={index} className='relative'>
              {(arrayPositions.length-1) != index
              ? 
              <Box position={position} color={colorFlag().color}/>  
              :
              <Flag color={colorFlag().color} shadow={colorFlag().shadow}/>
              }
              {
                players.map(player => {
                  if(player.positionActive === position.position && flag == player.flagActive){                  
                    return (
                    <div className='absolute bg-white text-black' key={player.teamName}>
                      {player.teamName}
                    </div>);
                  }else{
                    return null
                  }
                })
              }             
            </div>
          ))}
        </div>
    </>
  )
}

export default StepsBoard
