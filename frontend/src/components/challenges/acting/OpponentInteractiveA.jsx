import React, { useContext, useEffect, useState } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import HideWord from '../common/HideWord';
import ChooseTeamMember from '../common/ChooseTeamMember';
import { SocketContext } from '../../../context/SocketProvider';
import { getRandomMovie } from '../../../services/gameServices';
import { MovieList } from './MovieList';

const OpponentInteractiveA = ({wordReady}) => {

    const [word, setWord] = useState('');
    const [finalWord, setFinalWord] = useState('');
    const [oponentMember, setOponentMember] = useState('');
    const {socket} = useContext(SocketContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [urlImage, setUrlImage] = useState('');
    
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
      if(word != '' && oponentMember != ''){
        setErrorMessage('');
        setFinalWord(word);
        const data = {word, wordReady: true, oponentMember, urlImage, socketId: socket?.id};
        socket?.emit('acting', data);
      } else {
        setErrorMessage('Llena todos los campos antes de enviar la película')
      }
    }
  
    return (
      <div className='flex flex-col gap-6'>
        { !wordReady 
        ?
          <div className='flex flex-col gap-6'>
            <MovieList selectedMovie={word} setSelectedMovie={setWord} setUrlImage={setUrlImage}/>
            <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
            <button className='btn bg-blue-400' onClick={emitWordChallenge}>Enviar</button>
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

export default OpponentInteractiveA
