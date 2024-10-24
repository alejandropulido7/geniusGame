import React, { useRef, useEffect, useState, useContext } from 'react';
import AdminP from './AdminP';
import PlayerChallengeP from './PlayerChallengeP';
import OpponentInteractiveP from './OpponentInteractiveP';
import OtherPlayersP from './OtherPlayersP';
import {RENDER_CHALLENGE} from '../../../utils/constants';
import { SocketContext } from '../../../context/SocketProvider';

const Pictionary = ({renderIn}) => {
  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const [memberTeam, setMemberTeam] = useState('');
  const {socket} = useContext(SocketContext);

  useEffect(() => {
    const properties = JSON.parse(localStorage.getItem('pictionary-GG'));
    if(properties != null){
      setWord(properties.word);
      setMemberTeam(properties.memberTeam);
    }
  },[])

  useEffect(() => {
    localStorage.setItem('pictionary-GG', JSON.stringify({word, memberTeam}))
  },[word, memberTeam]);

  useEffect(() => {

    socket?.on('pictionary-data', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady);
      setMemberTeam(data.oponentMember);
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminP word={word}/>)
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

  },[socket, word, wordReady, renderIn]);

  return (
    <div>
      <div className='flex flex-col gap-5'>
        <h1 className='text-2xl title-wood text-white py-3'>Pictionary</h1>
        {render}
      </div>
    </div>
  );
};

export default Pictionary;
