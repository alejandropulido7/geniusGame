import React, { useContext, useEffect, useState } from 'react';
import socket from '../../../config/socket';
import KeyboardCW from './KeyboardCW';
import PlayerChallengeCW from './PlayerChallengeCW';
import { ChainWordsContext } from '../../../context/challenges/ChallengeContext';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import OpponentInteractiveCW from './OpponentInteractiveCW';

const ChainWord = ({renderIn}) => {
  const [ultimaPalabra, setUltimaPalabra] = useState('');
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [historialPalabras, setHistorialPalabras] = useState([]);

  const {lastWord, arrayWords} = useContext(ChainWordsContext);
  const [render, setRender] = useState(null);

  
  useEffect(() => {
    console.log('lastWord: '+lastWord);
    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<h1>Oponent</h1>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeCW/>)
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveCW/>)
      break;
    }  
  },[lastWord,renderIn])

  return (
    <div>
      <h1>Palabras Encadenadas</h1>
      <p>Última Palabra: {lastWord || 'Ninguna'}</p>
      <ul>
        {arrayWords.map((palabra, index) => (
          <li key={index}>{palabra}</li>
        ))}
      </ul>
      {render}
    </div>
  );
};

export default ChainWord;