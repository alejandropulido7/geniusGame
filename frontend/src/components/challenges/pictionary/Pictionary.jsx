import React, { useRef, useEffect, useState } from 'react';
import AdminP from './AdminP';
import PlayerChallengeP from './PlayerChallengeP';
import OpponentInteractiveP from './OpponentInteractiveP';
import OtherPlayersP from './OtherPlayersP';
import {RENDER_CHALLENGE} from '../../../utils/constants';
import socket from '../../../config/socket';

const Pictionary = ({renderIn}) => {
  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const [memberTeam, setMemberTeam] = useState('');

  useEffect(() => {

    socket.on('pictionary-data', (data) => {
      console.log('pictionary-data', data)
      setWord(data.word);
      setWordReady(data.wordReady);
      setMemberTeam(data.oponentMember);
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminP word={word} wordReady={wordReady}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeP word={word} memberTeam={memberTeam}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveP wordReady={wordReady}/>);
      break;
      default:
        setRender(<OtherPlayersP word={word}/>);
      break;
    }    

  },[word, wordReady, renderIn]);

  return (
    <div>
      <div>
        <h1>Actua la pelicula o serie</h1>
        <p>Descripcion</p>
        {render}
      </div>
    </div>
  );
};

export default Pictionary;
