import React, { useState, useEffect } from 'react'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA, WHISTLE_SONG} from '../../utils/constants'
import Hunged from './Hunged';
import ActingAndWhistle from './ActingAndWhistle';
import ChainWord from './ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';
import socket from '../../config/socket';

const BoardChallenges = ({activeChallenge, setActiveChallenge}) => {

  const [challengeFinished, setChallengeFinished] = useState(false);
  const [componentChallenge, setComponentChallenge] = useState(null);
  const [dataChallengeActive, setDataChallengeActive] = useState({});
  const [renderIn, setRenderIn] = useState(null);

  useEffect(() => {
    socket.on('renderChallenge', (dataChallenge) => {
      console.log('dataChallenge');
      console.log(dataChallenge);      
      if(dataChallenge.challenge != ''){
        setActiveChallenge(true);
        setDataChallengeActive(dataChallenge);
        if(dataChallenge.player.socketId == socket.id){
          setRenderIn('PLAYER');
          return
        } else if(dataChallenge.playerOpponent.socketId == socket.id){
          setRenderIn('OPPONENT_INTERACTIVE');
          return
        } else {
          setRenderIn('ADMIN');
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
        <h1>Contenedor de visor de challenges</h1>
        <Chronometer setChallengeFinished={setChallengeFinished}/>
        {componentChallenge}
      </>
      }
    </div>
  )
}

export default BoardChallenges
