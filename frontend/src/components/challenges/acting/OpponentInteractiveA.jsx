import React, { useContext, useEffect, useState } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import HideWord from '../common/HideWord';
import ChooseTeamMember from '../common/ChooseTeamMember';
import { SocketContext } from '../../../context/SocketProvider';
import { getRandomMovie } from '../../../services/gameServices';

const OpponentInteractiveA = ({wordReady}) => {

    const [word, setWord] = useState('');
    const [finalWord, setFinalWord] = useState('');
    const [oponentMember, setOponentMember] = useState('');
    const {socket} = useContext(SocketContext);
    const [textButton, setTextButton] = useState('Buscar sugerencia');
    
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
      const data = {word, wordReady: true, oponentMember, socketId: socket?.id};
      socket?.emit('acting', data);
      socket?.emit('startChallenge', {socketId: socket?.id});
    }

    const getMovieSuggested = async () => {
      const movie = await getRandomMovie();
      if(movie){
        setWord(movie.title);
      }
      setTextButton('Otra sugerencia');
    }
  
    return (
      <div className='flex flex-col gap-6'>
        { !wordReady 
        ?
          <div className='flex flex-col gap-6'>
            <textarea className='input' rows='2' value={word} placeholder='Escribe una palabra o frase' onChange={(e) => setWord(e.target.value)}/>
            <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
            <button className='btn' onClick={emitWordChallenge}>Sent word</button>
          </div>
        :
          <HideWord word={finalWord}/>  
        }
        <ValidateChallenge/>
        {(finalWord == '' && !wordReady) && 
        <div>
          <button type="text" onClick={getMovieSuggested}>{textButton}</button>
        </div>}
      </div>
    )
  }

export default OpponentInteractiveA
