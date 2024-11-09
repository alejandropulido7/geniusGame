import React, { useState, useContext, useEffect } from 'react'
import ValidateChallenge from '../common/ValidateChallenge';
import HideWord from '../common/HideWord';
import { SocketContext } from '../../../context/SocketProvider';
import ChooseTeamMember from '../common/ChooseTeamMember';

const OpponentInteractiveW = ({wordReady}) => {

    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');
    const [finalWord, setFinalWord] = useState('');
    const [oponentMember, setOponentMember] = useState('');
    const {socket} = useContext(SocketContext);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('whistle-opp-GG'));
      if(properties != null){
          setSong(properties.song);
          setArtist(properties.artist);
          // setOponentMember(properties.oponentMember);
          setFinalWord(properties.finalWord);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('whistle-opp-GG', JSON.stringify({song, finalWord, oponentMember, artist}));
    },[song, finalWord, oponentMember, artist]);
  
    const emitWordChallenge = () => {
      if(song != '' && oponentMember != '' && artist != ''){
        setErrorMessage('');
        const sendWord = artist + ' - ' + song;
        setFinalWord(sendWord);
        const data = {word: sendWord, wordReady: true, oponentMember, socketId: socket?.id};
        socket?.emit('whistle', data);
      } else {
        setErrorMessage('Llena todos los campos antes de enviar la canción')
      }
    }
  
    return (
      <>
        { !wordReady 
        ?
          <div className='flex flex-col gap-4 justify-center my-3'>
            <p>Ponle una canción al equipo contrario para que la tararee...</p>
            <div className='flex flex-col justify-center'>
              <label htmlFor="">Cantante o agrupación:</label>
              <input className='input' type="text" placeholder='Cantante o agrupación' onChange={(e) => setArtist(e.target.value)}/>
            </div>
            <div className='flex flex-col justify-center'>
              <label htmlFor="">Canción:</label>
              <input className='input' type="text" placeholder='Canción' onChange={(e) => setSong(e.target.value)}/>
            </div>
            <ChooseTeamMember setMember={setOponentMember} member={oponentMember}/>
            <button className='btn-wood text-white my-4 py-2' onClick={emitWordChallenge}>Enviar</button>
          </div>
        :
          <div className='my-4'>
            <HideWord word={finalWord}/>  
          </div>
        }
        <ValidateChallenge/>
        {errorMessage != '' && 
          <p className='text-red-600 text-center'>{errorMessage}</p>
        }
      </>
    )
  }

export default OpponentInteractiveW
