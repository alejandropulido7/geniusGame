import React from 'react'

const OpponentInteractiveAW = ({wordReady}) => {

    const [word, setWord] = useState('');
  
    const emitWordChallenge = () => {
      socket.emit('actingAndWhistle', {word, wordReady: true, socketId: socket.id});
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady && <div>
          <input type="text" placeholder='Type a phrase or word to your opponent' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={emitWordChallenge}>Sent word</button>
        </div>}
      </>
    )
  }

export default OpponentInteractiveAW
