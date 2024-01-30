import React, {useState, useEffect} from 'react'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import {setCookie, getCookie, hasCookie} from '../../utils/cookies'

const StepsBoard = ({arrayPositions, flag, players}) => {

  const [posicionJugador, setPosicionJugador] = useState(1);
  const [newPositions, setNewPositions] = useState([]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <h5>{flag}</h5>
        {arrayPositions.map((position, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              textAlign: 'center',
              lineHeight: '50px',
              background: position.position === posicionJugador ? 'lightblue' : 'white',
            }}
          >
            <p>{position.position}</p>
            <p>{position.challenge}</p>
            {
              players.map(player => {
                if(player.position === position.position && flag == player.flagActive){
                  return (<div key={player.teamName}>
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
  )
}

export default StepsBoard
