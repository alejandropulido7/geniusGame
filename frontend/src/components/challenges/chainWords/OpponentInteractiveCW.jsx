import React, { useEffect, useState } from 'react';
import socket from '../../../config/socket'
import {OPTIONS_CHALLENGES, getRandomObject} from '../../../utils/constants'
import ValidateChallenge from '../common/ValidateChallenge';

const OpponentInteractiveCW = ({lastWord}) => {

    const [word, setWord] = useState('');
    const [topic, setTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    

    const emitWordChallenge = () => {
      setErrorMessage('');
      if(word != '' && topic != ''){
        socket.emit('chainWords', {lastWord: word, wordList: [], socketId: socket.id, topic});
        socket.emit('startChallenge', {socketId: socket.id});
      } else {
        setErrorMessage('Debes escribir la palabra y escoger el tema');
      }
    }

    const topicChanged = (event) => {
      const value = event.target.value;
      if(value != ''){
        setTopic(event.target.value);
      }
    };

    return (
      <div>       
        { lastWord == '' ?
        <div>
          <p>Envia la primera palabra a tu oponente y selecciona un tema</p>
          <input type="text" placeholder='Escribe una palabra segun el tema' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={emitWordChallenge}>Sent word</button>
          <select value={topic} onChange={topicChanged}>
            <option value="">Selecciona un tema..</option>
            {
              OPTIONS_CHALLENGES.word_chain.topics.map(topicMap => {
                return (
                  <option key={topicMap} value={topicMap}>{topicMap}</option>
                );
              })
            }
          </select>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        : 
        <div>
          <p>Tema: {topic}</p>
          <p>Ultima palabra: {lastWord}</p>
        </div>
        }
        <ValidateChallenge/>
      </div>
    )
  }

export default OpponentInteractiveCW
