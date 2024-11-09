import React, {useState, useEffect, useContext} from 'react';
import ChooseTeamMember from '../common/ChooseTeamMember';
import HideWord from '../common/HideWord';
import ValidateChallenge from '../common/ValidateChallenge';
import { SocketContext } from '../../../context/SocketProvider';

const OpponentInteractiveP = ({wordReady}) => {

  const [word, setWord] = useState('');
  const [finalWord, setFinalWord] = useState('');
  const [oponentMember, setOponentMember] = useState('');
  const {socket} = useContext(SocketContext);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const properties = JSON.parse(localStorage.getItem('pictionary-opp-GG'));
    if(properties != null){
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
    if(socket){
      if(word != '' && oponentMember != ''){
        const data = {word, wordReady: true, oponentMember, socketId: socket.id};
        socket.emit('pictionary', {function: 'data', data});
      } else {
        setErrorMessage('Llena todos los campos antes de enviar')
      }
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      { !wordReady 
      ?
        <div className='flex flex-col justify-center'>
          <label>Palabra o frase:</label>
          <input className='input my-2' type="text" placeholder='Escribe una palabra o frase' value={word} onChange={(e) => setWord(e.target.value)}/>
          <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
          <button className='btn-wood py-2 text-white my-4' onClick={emitWordChallenge}>Enviar palabra</button>
        </div>
      :
        <HideWord word={finalWord}/>  
      }
      <ValidateChallenge/>
      {errorMessage != '' && 
          <p className='text-red-600 text-center'>{errorMessage}</p>
        }
    </div>
  )
}

export default OpponentInteractiveP
