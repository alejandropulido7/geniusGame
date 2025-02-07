import React, { useContext, useEffect, useState } from 'react';
import PlayerChallengeCW from './PlayerChallengeCW';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import OpponentInteractiveCW from './OpponentInteractiveCW';
import AdminCW from './AdminCW';
import { SocketContext } from '../../../context/SocketProvider';
import { findFlagProperties } from '../../../utils/constants';

const ChainWord = ({renderIn, dataPlayer}) => {

  const [lastWord, setLastWord] = useState('');
  const [arrayWords, setArrayWords] = useState([]);
  const [render, setRender] = useState(null);
  const [showOponnent, setShowOpponent] = useState(false);
  const [topic, setTopic] = useState('');
  const {socket} = useContext(SocketContext);

  useEffect(() => {
    if(localStorage.getItem('chainWords-GG') != null){
        const properties = JSON.parse(localStorage.getItem('chainWords-GG'));
        setLastWord(prev => properties.lastWord??prev);
        setArrayWords(prev => properties.arrayWords??prev);
        setShowOpponent(prev => properties.showOponnent??prev);
        setTopic(prev => properties.topic??prev);
    }
  },[])
  
  useEffect(() => {
    localStorage.setItem('chainWords-GG', JSON.stringify({lastWord, arrayWords, showOponnent, topic}));
  },[lastWord, arrayWords, showOponnent, topic])
  
  useEffect(() => {
    socket?.on('chainWords', (data) => {
      setLastWord(data.lastWord);
      setArrayWords(data.wordList);
      setTopic(data.topic);
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminCW arrayWords={arrayWords}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeCW lastWord={lastWord} dataPlayer={dataPlayer}/>)
      break;
      case RENDER_CHALLENGE.opponent:
        setShowOpponent(true);
        setRender(<OpponentInteractiveCW lastWord={lastWord}/>)
      break;
      default:
        setShowOpponent(true);
      break;
    }  

    return () => {
      socket?.off('chainWords');
      socket?.off('validateChallenge');
    }

  },[lastWord, renderIn, arrayWords, topic]);


  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-2xl uppercase text-indigo-500 my-5'>Palabras Encadenadas</h1>      
      {!showOponnent && <div>
        <p>Tema: {topic || 'Esperando al oponente'}</p>
        {lastWord ? <p>Última Palabra: {lastWord}</p> : <p></p>}
      </div>}
      {render}
    </div>
  );
};

export default ChainWord;