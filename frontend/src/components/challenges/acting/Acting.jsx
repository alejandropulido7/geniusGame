import React, { useContext, useEffect, useState } from 'react';
import AdminA from './AdminA';
import PlayerChallengeA from './PlayerChallengeA';
import OpponentInteractiveA from './OpponentInteractiveA';
import OthersPlayersA from './OthersPlayersA';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';


const Acting = ({renderIn}) => {

  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const {socket} = useContext(SocketContext);
  const [teamPlayer, setTeamPlayer] = useState('');
  const [movieImage, setMovieImage] = useState('');

  useEffect(() => {
    const properties = JSON.parse(localStorage.getItem('acting-GG'));
    if(properties != null){
        setWord(properties.word);
        setWordReady(properties.wordReady);
        setTeamPlayer(properties.teamPlayer);
        setMovieImage(properties.movieImage)
    }
  },[])

  useEffect(() => {
    localStorage.setItem('acting-GG', JSON.stringify({word, wordReady, teamPlayer, movieImage}));
  },[word, wordReady, teamPlayer, movieImage])

  useEffect(() => {
  
    socket?.on('acting', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady);
      setTeamPlayer(data.oponentMember);
      setMovieImage(data.urlImage);
    });

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminA word={word} wordReady={wordReady} movieImage={movieImage}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeA word={word} teamPlayer={teamPlayer}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveA wordReady={wordReady}/>);
      break;
      default:
        setRender(<OthersPlayersA word={word}/>);
      break;
    }    

  },[socket, word, wordReady, renderIn, teamPlayer, movieImage]);
  

  return (
    <div>
      <div className='challenge-center'>
        {render}
      </div>
    </div>
  );
};


export default Acting;