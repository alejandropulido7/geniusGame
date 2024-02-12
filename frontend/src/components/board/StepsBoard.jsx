import React, {useState, useEffect} from 'react'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import {setCookie, getCookie, hasCookie} from '../../utils/cookies'
import socket from '../../config/socket';

const StepsBoard = ({arrayPositions, flag, players}) => {

  const [posicionJugador, setPosicionJugador] = useState(1);
  
  useEffect(() => {

  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <h5>{flag}</h5>
        {arrayPositions.map((position, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              textAlign: 'center',
              lineHeight: '50px'
            }}
          >
            <p>{position.position}</p>
            <p>{position.challenge}</p>
            {
              players.map(player => {
                if(player.positionActive === position.position && flag == player.flagActive){                  
                  return (
                  <div key={player.teamName}>
                    <p style={{background: 'green', padding: '2px', color: '#FFF'}}>{player.teamName}</p>
                  </div>);
                }else{
                  return null
                }
              })
            }
          </div>
        ))}
      </div>
  )
}

export default StepsBoard
