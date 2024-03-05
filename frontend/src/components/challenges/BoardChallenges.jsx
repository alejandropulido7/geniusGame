import React, { useState, useEffect, useContext } from 'react'
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA, WHISTLE_SONG} from '../../utils/constants'
import Hunged from './Hunged';
import ActingAndWhistle from './ActingAndWhistle';
import ChainWord from './ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';
import socket from '../../config/socket';
import {getCookie} from '../../utils/cookies';
import { ChallengeContext } from '../../context/challenges/ChallengeContext';

const BoardChallenges = ({activeChallenge, setActiveChallenge}) => {

  const [challengeFinished, setChallengeFinished] = useState(false);
  const [componentChallenge, setComponentChallenge] = useState(null);
  const [dataChallengeActive, setDataChallengeActive] = useState({});
  const [renderIn, setRenderIn] = useState(null);
  const [pathChallenge, setPathChallenge] = useState('');
  const {challenge} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('renderChallenge', (dataChallenge) => {
      console.log('dataChallenge');
      console.log(dataChallenge);     
      if(dataChallenge.challenge != ''){
        setActiveChallenge(true);
        setDataChallengeActive(dataChallenge);
        switch (socket.id) {
          case dataChallenge.player.socketId:
            console.log('render player: '+socket.id);
            setRenderIn('PLAYER');
          break;
          case dataChallenge.playerOpponent.socketId:
            console.log('render opponent: '+socket.id);
            setRenderIn('OPPONENT_INTERACTIVE'); 
          break;
          case dataChallenge.board:
            console.log('render admin: '+socket.id);
            setRenderIn('ADMIN');
          break;
        }
      }
    });

    switch (dataChallengeActive.challenge) {
      case ACTING:
        setComponentChallenge(<ActingAndWhistle renderIn={renderIn}/>)
        break;
      case WHISTLE_SONG:
        setComponentChallenge(<ActingAndWhistle />)
        break;
      case WORD_CHAIN:
        setComponentChallenge(<ChainWord />)
        break;
      case PICTIONARY:
        setComponentChallenge(<Pictionary />)
        break;
      case TRIVIA:
        setComponentChallenge(<Trivia />)
        break;
      case HUNGED:
        setComponentChallenge(<Hunged />)
        break;  
      case BACK_HOME:
        setComponentChallenge(<div><h1>BACK HOME</h1><button onClick={() => setActiveChallenge(false)}>Terminar</button></div>)
        break; 
      default:
        setComponentChallenge(null)
        break;
    }

    return () => {
      socket.off('renderChallenge');
      
    }
  }, [dataChallengeActive])


  return (
    <div>
      { activeChallenge && 
      <>
        <h2>Pasa el reto para poder avanzar</h2>
        {renderIn=='ADMIN' && <Chronometer data={dataChallengeActive}/>}
        {componentChallenge}        
      </>
      }
    </div>
  )
}

export default BoardChallenges
