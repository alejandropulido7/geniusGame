import React, { useState } from 'react'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA} from '../../utils/constants'
import Hunged from './Hunged';
import ActingAndWhistle from './ActingAndWhistle';
import ChainWord from './ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';

const ContainerChallenges = ({setActiveChallenge, dataChallenge}) => {

  const [challengeFinished, setChallengeFinished] = useState(false);
  const [componentChallenge, setComponentChallenge] = useState(null);

  switch (dataChallenge.challenge) {
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
    default:
      setComponentChallenge(null)
      break;
  }

  return (
    <div>
      <h1>Contenedor de visor de challenges</h1>
      <Chronometer setChallengeFinished={setChallengeFinished}/>
      {componentChallenge}
    </div>
  )
}

export default ContainerChallenges
