import React, {useState, useEffect} from 'react';
import socket from '../../../config/socket';
import ChooseTeamMember from '../common/ChooseTeamMember';
import HideWord from '../common/HideWord';
import ValidateChallenge from '../common/ValidateChallenge';

const OpponentInteractiveP = ({wordReady}) => {

  const [word, setWord] = useState('');
  const [finalWord, setFinalWord] = useState('');
  const [oponentMember, setOponentMember] = useState('');

  useEffect(() => {
    if(localStorage.getItem('pictionary-opp-GG') != null){
        const properties = JSON.parse(localStorage.getItem('pictionary-opp-GG'));
        setWord(prev => properties.word??prev);
        setFinalWord(prev => properties.finalWord??prev);
        setOponentMember(prev => properties.oponentMember??prev);
    }
  },[]);

  useEffect(() => {
    localStorage.setItem('pictionary-opp-GG', JSON.stringify({word, finalWord, oponentMember}));
  },[word, finalWord, oponentMember]);  

  const emitWordChallenge = () => {
    setFinalWord(word);
    const data = {word, wordReady: true, oponentMember, socketId: socket.id};
    socket.emit('pictionary', {function: 'data', data});
    socket.emit('startChallenge', {socketId: socket.id});
  }

  return (
    <div>
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
      
    </div>
  )
}

export default OpponentInteractiveP
