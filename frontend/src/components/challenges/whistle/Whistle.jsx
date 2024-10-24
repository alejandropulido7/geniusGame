import React, { useEffect, useState, useContext } from 'react';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import AdminW from './AdminW';
import PlayerChallengeW from './PlayerChallengeW';
import OpponentInteractiveW from './OpponentInteractiveW';
import OthersPlayersW from './OthersPlayersW';
import { SocketContext } from '../../../context/SocketProvider';


const Whistle = ({renderIn}) => {

  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const {socket} = useContext(SocketContext);
  const [teamPlayer, setTeamPlayer] = useState('');

  useEffect(() => {
    const properties = JSON.parse(localStorage.getItem('whistle-GG'));
    if(properties != null){
        setWord(properties.word);
        setWordReady(properties.wordReady)
        setTeamPlayer(properties.teamPlayer);
    }
  },[])

  useEffect(() => {
    localStorage.setItem('whistle-GG', JSON.stringify({word, wordReady, teamPlayer}));
  },[word, wordReady, teamPlayer])


  useEffect(() => {
  
    socket?.on('whistle', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady);
      setTeamPlayer(data.oponentMember);
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminW word={word} wordReady={wordReady}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeW word={word} teamPlayer={teamPlayer}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveW wordReady={wordReady}/>);
      break;
      default:
        setRender(<OthersPlayersW word={word}/>);
      break;
    }    

  },[socket, word, wordReady, teamPlayer, renderIn]);
  

  return (
    <div>
      <h1 className='title-wood text-white py-2 px-5 my-7 text-2xl'>Silba o tararea la cancion</h1>
      {render}
    </div>
  );
};


export default Whistle;