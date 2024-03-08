import React from 'react'

const PlayerChallengeAW = () => {

    const emitResult = () => {
      socket.emit('resultChallenge', {playerId: socket.id, challengePassed: true});
    }
  
    return (
      <div>
        <button onClick={emitResult}>Terminar</button>
      </div>
    )
  }

export default PlayerChallengeAW
