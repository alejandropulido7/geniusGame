import React, { useEffect, useState, useContext } from 'react';
import {OPTIONS_CHALLENGES, WORD_CHAIN} from '../../../utils/constants'
import ValidateChallenge from '../common/ValidateChallenge';
import { SocketContext } from '../../../context/SocketProvider';

const OpponentInteractiveCW = ({lastWord}) => {

    const [word, setWord] = useState('');
    const [topic, setTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {socket} = useContext(SocketContext);
    const [customTopic, setCustomTopic] = useState('');

    useEffect(() => {
      if(localStorage.getItem('chainWords-Opp-GG') != null){
        setWord(JSON.parse(localStorage.getItem('chainWords-Opp-GG')).word);
        setTopic(JSON.parse(localStorage.getItem('chainWords-Opp-GG')).topic);
        setErrorMessage(JSON.parse(localStorage.getItem('chainWords-Opp-GG')).errorMessage);
    } 
    },[])
    
    useEffect(() => {
      localStorage.setItem('chainWords-Opp-GG', JSON.stringify({word, topic, errorMessage}));
    },[word, topic, errorMessage])

    const emitWordChallenge = () => {
      setErrorMessage('');
      if(word != '' && topic != ''){
        if(topic == 10 && customTopic == ''){
          setErrorMessage('Debes escribir el tema personalizado');
          return;
        }
        if(socket){
          const findTopicName = OPTIONS_CHALLENGES.get(WORD_CHAIN).topics.filter(val => val.id == topic);
          console.log(findTopicName);
          let topicSend = findTopicName.topic;
          if(topic == 10){
            topicSend = customTopic;
          }
          socket.emit('chainWords', {lastWord: word, wordList: [], socketId: socket.id, topic: topicSend});
          socket.emit('startChallenge', {socketId: socket.id});
        }
      } else {
        setErrorMessage('Debes escribir la palabra y escoger el tema');
      }
    }

    const topicChanged = (event) => {
      const value = event.target.value;
      if(value != ''){
        console.log(value)
        setTopic(value);
      }
    };

    return (
      <div>       
        { lastWord == '' ?
        <div className='flex flex-col gap-5'>
          <p>Envia la primera palabra a tu oponente y selecciona un tema</p>
                  
          <select className='select' value={topic} onChange={topicChanged}>
            <option value="">Selecciona un tema..</option>
            {
              OPTIONS_CHALLENGES.get(WORD_CHAIN).topics.map(topicMap => {
                return (
                  <option key={topicMap.id} value={topicMap.id}>{topicMap.topic}</option>
                );
              })
            }
          </select>
          { topic == 10 && 
            <input className='input' type="text" placeholder='Escribe tu propio tema' onChange={(e) => setCustomTopic(e.target.value)}/>
          }
          <textarea rows={2} className='input' placeholder='Escribe una palabra segun el tema' onChange={(e) => setWord(e.target.value.trim())}/>
          <button className='btn bg-indigo-400' onClick={emitWordChallenge}>Enviar palabra</button>
          {errorMessage != '' && <p className='text-red-500'>{errorMessage}</p>}
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
