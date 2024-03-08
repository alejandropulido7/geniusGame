import React, { useState, useEffect, useContext } from 'react'
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA, WHISTLE_SONG, OPTIONS_CHALLENGES, RENDER_CHALLENGE} from '../../utils/constants'
import Hunged from './Hunged';
import ActingAndWhistle from './actingAndWhistle/ActingAndWhistle';
import ChainWord from './chainWords/ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';
import socket from '../../config/socket';
import {getCookie} from '../../utils/cookies';
import { ChallengeContext } from '../../context/challenges/ChallengeContext';
import ChainWordChallengeState from '../../context/challenges/ChainWordsChallengeState';

const BoardChallenges = ({activeChallenge, setActiveChallenge}) => {

  const [challengeFinished, setChallengeFinished] = useState(false);
  const [componentChallenge, setComponentChallenge] = useState(null);
  const [dataChallengeActive, setDataChallengeActive] = useState({});
  const [renderIn, setRenderIn] = useState(null);
  const [pathChallenge, setPathChallenge] = useState('');
  const {challenge} = useParams();
  const navigate = useNavigate();

  // if(localStorage.getItem('challengeActive-GG') != undefined){
  //   setDataChallengeActive({challenge: localStorage.getItem('challengeActive-GG')});
  // }
  // if(localStorage.getItem('renderIn-GG') != undefined){
  //   setDataChallengeActive({challenge: localStorage.getItem('renderIn-GG')});
  // }

  useEffect(() => {

    console.log(localStorage.getItem('challengeActive-GG'))
    console.log(localStorage.getItem('renderIn-GG'))

    socket.on('renderChallenge', (dataChallenge) => {
      console.log('dataChallenge');
      console.log(dataChallenge);     
      if(dataChallenge.challenge != ''){
        setActiveChallenge(true);
        setDataChallengeActive(dataChallenge);
        localStorage.setItem('challengeActive-GG', dataChallenge.challenge);
        switch (socket.id) {
          case dataChallenge.player.socketId:
            setRenderIn(RENDER_CHALLENGE.player);
          break;
          case dataChallenge.playerOpponent.socketId:
            setRenderIn(RENDER_CHALLENGE.opponent); 
          break;
          case dataChallenge.board:
            setRenderIn(RENDER_CHALLENGE.admin);
          break;
        }
        localStorage.setItem('renderIn-GG', renderIn);
      }
    });

    switch (dataChallengeActive.challenge) {
      case ACTING:
        setComponentChallenge(<ActingAndWhistle renderIn={renderIn} title={OPTIONS_CHALLENGES.acting.title} description={OPTIONS_CHALLENGES.acting.description}/>)
        break;
      case WHISTLE_SONG:
        setComponentChallenge(<ActingAndWhistle renderIn={renderIn} title={OPTIONS_CHALLENGES.whistle_song.title} description={OPTIONS_CHALLENGES.whistle_song.description}/>)
        break;
      case WORD_CHAIN:
        setComponentChallenge(<ChainWordChallengeState><ChainWord renderIn={renderIn}/></ChainWordChallengeState>)
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
