import React, { useState, useEffect } from 'react'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA} from '../../utils/constants'
import Hunged from './Hunged';
import ActingAndWhistle from './ActingAndWhistle';
import ChainWord from './ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';
import socket from '../../config/socket';

const ContainerChallenges = ({setActiveChallenge}) => {

  const [challengeFinished, setChallengeFinished] = useState(false);
  const [componentChallenge, setComponentChallenge] = useState(null);
  const [dataChallengeActive, setDataChallengeActive] = useState({});

  useEffect(() => {
    socket.on('renderChallenge', (dataChallenge) => {
      console.log('dataChallenge');
      console.log(dataChallenge);
      if(dataChallenge.challenge != ''){
        setActiveChallenge(true);
        setDataChallengeActive(dataChallenge);
      }
    });

    switch (dataChallengeActive.challenge) {
      case ACTING:
        setComponentChallenge(<ActingAndWhistle/>)
        break;
      case WORD_CHAIN:
        setComponentChallenge(<ChainWord/>)
        break;
      case PICTIONARY:
        setComponentChallenge(<Pictionary/>)
        break;
      case TRIVIA:
        setComponentChallenge(<Trivia/>)
        break;
      case HUNGED:
        setComponentChallenge(<Hunged/>)
        break;  
      case BACK_HOME:
        setComponentChallenge(<h1>BACK HOME</h1>)
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
      <h1>Contenedor de visor de challenges</h1>
      <Chronometer setChallengeFinished={setChallengeFinished}/>
      {componentChallenge}
    </div>
  )
}

export default ContainerChallenges
