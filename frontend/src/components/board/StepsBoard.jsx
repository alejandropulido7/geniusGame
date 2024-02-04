import React, {useState, useEffect} from 'react'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import {setCookie, getCookie, hasCookie} from '../../utils/cookies'
import socket from '../../config/socket';

const StepsBoard = ({arrayPositions, flag, players}) => {

  const [posicionJugador, setPosicionJugador] = useState(1);
  
  useEffect(() => {
    // renderOngoingChallenge(); //Se envia varias veces al recargar la pagina
    socket.on("playerMoved", (player) => {
      emitChallenge(player);
    });

    return () => {
      socket.off('playerMoved');
    }
  }, []);

  const renderOngoingChallenge = () => {
    const ongoingChallenge = localStorage.getItem('ongoingChallenge-GG');
    if(ongoingChallenge){
      const challenge = JSON.parse(ongoingChallenge);
      socket.emit('renderChallenge', challenge);
    }
  }

  const emitChallenge = (player) => {
    const positionPlayerInArray = arrayPositions.find(position => position.position == player.positionActive && flag == player.flagActive);
    console.log('positionPlayerInArray');
    console.log(positionPlayerInArray);
    if(positionPlayerInArray && positionPlayerInArray.challenge != ''){
      const ongoingChallenge = {
        challenge: positionPlayerInArray.challenge,
        player: player
      };
      localStorage.setItem('ongoingChallenge-GG', JSON.stringify(ongoingChallenge));
      socket.emit('renderChallenge', ongoingChallenge);
    }
  }

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
                if(player.positionActive === position.position && flag == player.flagActive){                  
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
