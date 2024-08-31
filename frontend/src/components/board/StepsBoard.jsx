import React, {useState, useEffect} from 'react'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import {setCookie, getCookie, hasCookie} from '../../utils/cookies'
import socket from '../../config/socket';

const StepsBoard = ({arrayPositions, flag, players}) => {

  const [posicionJugador, setPosicionJugador] = useState(1);
  
  useEffect(() => {

  }, []);

  const findIconChallenge = (id) => {
    const challengeFound = CHALLENGES_IN_BOARD.find(challenge => challenge.id == id);
    if(challengeFound){
      return <img width='25x' height='25px' src={challengeFound.icon}></img>
    }
    return <p></p>
  }



  return (
    <>
      <div className={`flex flex-wrap my-5 p-7 rounded-md overflow-visible`}
        style={{border: `double ${flag} 5px`}}
        >
          {/* <h5>{flag}</h5> */}
          {arrayPositions.map((position, index) => (
            <div
              className={`relative w-16 h-12 rounded-md bg-slate-200 overflow-visible`}
              key={index}
              style={{
                border: '1px solid #ccc',
                textAlign: 'center',
                lineHeight: '50px',
                // clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                // background: `${flag}`,
              }}
            >
              <div className='absolute -top-0 text-xs'>{position.position}</div>
              <div className='absolute -right-0 z-10'>
                {findIconChallenge(position.challenge)}
              </div>
              {
                players.map(player => {
                  if(player.positionActive === position.position && flag == player.flagActive){                  
                    return (
                    <div className='bg-black text-white' key={player.teamName}>
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
        <div>
          {flag}
        </div>
    </>
  )
}

export default StepsBoard
