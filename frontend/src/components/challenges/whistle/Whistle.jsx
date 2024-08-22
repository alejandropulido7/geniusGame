import React, { useEffect, useState } from 'react';
import socket from '../../../config/socket';
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import {RENDER_CHALLENGE} from '../../../utils/constants'
import AdminAW from './AdminW';
import PlayerChallengeAW from './PlayerChallengeW';
import OpponentInteractiveAW from './OpponentInteractiveW';
import OthersPlayersAW from './OthersPlayersW';
import AdminW from './AdminW';
import PlayerChallengeW from './PlayerChallengeW';
import OpponentInteractiveW from './OpponentInteractiveW';
import OthersPlayersW from './OthersPlayersW';


const Whistle = ({renderIn}) => {

  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('whistle-GG') != null){
        const properties = JSON.parse(localStorage.getItem('whistle-GG'));
        setWord(prev => properties.word??prev);
        setWordReady(prev => properties.wordReady??prev)
    }
  },[])

  useEffect(() => {
    localStorage.setItem('whistle-GG', JSON.stringify({word, wordReady}));
  },[word, wordReady])


  useEffect(() => {
  
    socket.on('whistle', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady)
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminW word={word} wordReady={wordReady}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeW word={word}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveW wordReady={wordReady}/>);
      break;
      default:
        setRender(<OthersPlayersW word={word}/>);
      break;
    }    

  },[word, wordReady, renderIn]);
  

  return (
    <div>
      <h1>Silba o tararea la cancion</h1>
      <p>Descripcion</p>
      {render}
    </div>
  );
};


export default Whistle;