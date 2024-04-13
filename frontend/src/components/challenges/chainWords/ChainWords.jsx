import React, { useContext, useEffect, useState } from 'react';
import socket from '../../../config/socket';
import PlayerChallengeCW from './PlayerChallengeCW';
import { ChainWordsContext } from '../../../context/challenges/GlobalContext';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import OpponentInteractiveCW from './OpponentInteractiveCW';
import AdminCW from './AdminCW';

const ChainWord = ({renderIn, dataPlayer}) => {

  const {lastWord, arrayWords, setLastWord, setArrayWords} = useContext(ChainWordsContext);
  const [render, setRender] = useState(null);
  const [showOponnent, setShowOpponent] = useState(false);
  const [topic, setTopic] = useState('');
  
  
  useEffect(() => {
    socket.on('chainWords', (data) => {
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
    }  

    return () => {
      socket.off('chainWords');
      socket.off('validateChallenge');
    }

  },[lastWord,renderIn]);


  return (
    <div>
      <h1>Palabras Encadenadas</h1>      
      {!showOponnent && <div>
        <p>Tema: {topic || 'Esperando oponente'}</p>
        {lastWord ? <p>Última Palabra: {lastWord}</p> : <p>Esperando a que el oponente envie la primera palabra...</p>}
      </div>}
      {render}
    </div>
  );
};

export default ChainWord;