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
      if(localStorage.getItem('acting-opp-GG') != null){
          const properties = JSON.parse(localStorage.getItem('acting-opp-GG'));
          setWord(prev => properties.word??prev);
          setFinalWord(prev => properties.finalWord??prev);
          setOponentMember(prev => properties.oponentMember??prev);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('acting-opp-GG', JSON.stringify({word, finalWord, oponentMember}));
    },[word, finalWord, oponentMember]);  
  
    const emitWordChallenge = () => {
      setFinalWord(word);
      const data = {word, wordReady: true, oponentMember, socketId: socket.id};
      socket.emit('acting', data);
      socket.emit('startChallenge', {socketId: socket.id});
    }
  
    return (
      <>
        { !wordReady 
        ?
          <div>
            <input className='input' type="text" placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
            <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
            <button className='btn' onClick={emitWordChallenge}>Sent word</button>
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
