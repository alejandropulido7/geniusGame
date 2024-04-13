import React from 'react'
import ValidateChallenge from '../ValidateChallenge';

const OpponentInteractiveAW = ({wordReady}) => {

    const [word, setWord] = useState('');
  
    const emitWordChallenge = () => {
      socket.emit('actingAndWhistle', {word, wordReady: true, socketId: socket.id});
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady && 
        <div>
          <input type="text" placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={emitWordChallenge}>Sent word</button>
        </div>}
        <ValidateChallenge/>
      </>
    )
  }

export default OpponentInteractiveAW
