import React from 'react'

const PlayerChallengeAW = () => {

    const emitResult = () => {
      socket.emit('stopChallenge', {socketId: socket.id});
    }
  
    return (
      <div>
        <button onClick={emitResult}>Terminar</button>
      </div>
    )
  }

export default PlayerChallengeAW
