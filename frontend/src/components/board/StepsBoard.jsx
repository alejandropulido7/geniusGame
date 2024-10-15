import React, {useState, useEffect} from 'react'
import {FLAGS, findFlagProperties} from '../../utils/constants'
import Box from './Box';
import Flag from './Flag';
import Piece from './Piece';

const StepsBoard = ({arrayPositions, flag, players, stlyeClass}) => {
  
  const colorFlag = () => {
    return findFlagProperties(flag);
  }

  useEffect(() => {
  },[players])

  return (
    <>
      <div className={`${stlyeClass} flex flex-wrap my-5 py-3 rounded-md overflow-visible`}>
          {arrayPositions.map((position, index) => (
            <div key={index} className='relative'>
              {(arrayPositions.length-1) != index
              ? 
              <Box position={position} color={colorFlag().color}/>  
              :
              <Flag color={colorFlag().color} shadow={colorFlag().shadow}/>
              }
              {
                players.map((player, index) => {
                  if(player.positionActive === position.position && flag == player.flagActive){                  
                    return (
                    <div className={`absolute transition-all top-0 text-white`} key={player.teamName} style={{left: `${index*25}px`, rotate: `${index*10}deg`}}>
                      <Piece color={player.propPiece.color} emoji={player.propPiece.emoji} h={60} w={60} teamName={player.teamName}/>
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
