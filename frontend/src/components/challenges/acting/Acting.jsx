import React, { useEffect, useState } from 'react';
import socket from '../../../config/socket';
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import {RENDER_CHALLENGE} from '../../../utils/constants'
import PlayerChallengeAW from './PlayerChallengeA';
import OpponentInteractiveAW from './OpponentInteractiveA';
import OthersPlayersAW from './OthersPlayersA';
import AdminA from './AdminA';
import PlayerChallengeA from './PlayerChallengeA';
import OpponentInteractiveA from './OpponentInteractiveA';
import OthersPlayersA from './OthersPlayersA';


const Acting = ({renderIn}) => {

  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);

  useEffect(() => {
  
    socket.on('acting', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady)
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminA word={word} wordReady={wordReady}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeA word={word}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveA wordReady={wordReady}/>);
      break;
      default:
        setRender(<OthersPlayersA word={word}/>);
      break;
    }    

  },[word, wordReady, renderIn]);
  

  return (
    <div>
      <h1>Actua la pelicula o serie</h1>
      <p>Descripcion</p>
      {render}
    </div>
  );
};


export default Acting;