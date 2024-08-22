import React, { useState } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import HideWord from '../common/HideWord';
import socket from '../../../config/socket';

const OpponentInteractiveW = ({wordReady}) => {

    const [word, setWord] = useState('');
    const [finalWord, setFinalWord] = useState('');
    const [oponentMember, setOponentMember] = useState('');
    
    useEffect(() => {
      if(localStorage.getItem('whistle-opp-GG') != null){
          const properties = JSON.parse(localStorage.getItem('whistle-opp-GG'));
          setWord(prev => properties.word??prev);
          setFinalWord(prev => properties.finalWord??prev);
          setOponentMember(prev => properties.oponentMember??prev);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('whistle-opp-GG', JSON.stringify({word, finalWord, oponentMember}));
    },[word, finalWord, oponentMember]);
  
    const emitWordChallenge = () => {
      setFinalWord(word);
      socket.emit('whistle', {word, wordReady: true, socketId: socket.id});
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady 
        ?
          <div>
            <input type="text" placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
            <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
            <button onClick={emitWordChallenge}>Sent word</button>
          </div>
        :
          <HideWord word={finalWord}/>  
        }
        <ValidateChallenge/>
        <div>
          <p>Aqui va el listado de canciones sugeridas</p>
        </div>
      </>
    )
  }

export default OpponentInteractiveW
