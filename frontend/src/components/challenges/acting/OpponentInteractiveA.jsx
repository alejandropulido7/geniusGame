import React, { useContext, useEffect, useState } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import socket from '../../../config/socket';
import HideWord from '../common/HideWord';
import ChooseTeamMember from '../common/ChooseTeamMember';

const OpponentInteractiveA = ({wordReady}) => {

    const [word, setWord] = useState('');
    const [finalWord, setFinalWord] = useState('');
    const [oponentMember, setOponentMember] = useState('');
    
    useEffect(() => {
    },[]);    
  
    const emitWordChallenge = () => {
      setFinalWord(word);
      socket.emit('acting', {word, wordReady: true, oponentMember, socketId: socket.id});
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady 
        ?
          <div>
            <input type="text" placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
            <ChooseTeamMember setMember={setOponentMember}/>
            <button onClick={emitWordChallenge}>Sent word</button>
          </div>
        :
          <HideWord word={finalWord}/>  
        }
        <ValidateChallenge/>
        <div>
          <p>Aqui va el listado de peliculas o series sugeridos</p>
        </div>
      </>
    )
  }

export default OpponentInteractiveA
