import React, { useState, useEffect, useContext } from 'react'
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA, WHISTLE_SONG, OPTIONS_CHALLENGES, RENDER_CHALLENGE} from '../../utils/constants'
import Hunged from './hunged/Hunged';
import ActingAndWhistle from './actingAndWhistle/ActingAndWhistle';
import ChainWord from './chainWords/ChainWords';
import Pictionary from './Pictionary';
import Trivia from './Trivia';
import socket from '../../config/socket';
import ChainWordChallengeState from '../../context/challenges/ChainWordsChallengeState';
import HungedChallengeState from '../../context/challenges/HungedChallengeState';
import { GlobalContext } from '../../context/challenges/GlobalContext';

const BoardChallenges = () => {

  const [componentChallenge, setComponentChallenge] = useState(null);
  // const [renderIn, setRenderIn] = useState(null);
  const {activeChallenge, setActiveChallenge, dataChallenge, setDataChallenge, renderPlayer, setRenderPlayer} = useContext(GlobalContext);



  useEffect(() => {

    console.log('dataChallenge', dataChallenge);     

    socket.on('renderChallenge', (dataChallengeSocket) => {
      if(dataChallengeSocket.challenge != ''){
        setActiveChallenge(true);
        setDataChallenge(dataChallengeSocket);
        localStorage.setItem('activeChallenge-GG', true);
        localStorage.setItem('dataChallenge-GG', JSON.stringify(dataChallengeSocket));
        switch (socket.id) {
          case dataChallengeSocket.player.socketId:
            localStorage.setItem('renderIn-GG', RENDER_CHALLENGE.player);
            setRenderPlayer(RENDER_CHALLENGE.player);
          break;
          case dataChallengeSocket.playerOpponent.socketId:
            localStorage.setItem('renderIn-GG', RENDER_CHALLENGE.opponent);
            setRenderPlayer(RENDER_CHALLENGE.opponent); 
          break;
          case dataChallengeSocket.board:
            localStorage.setItem('renderIn-GG', RENDER_CHALLENGE.admin);
            setRenderPlayer(RENDER_CHALLENGE.admin);
          break;
        }
        
      }
    });

    switch (dataChallenge.challenge) {
      case ACTING:
        setComponentChallenge(<ActingAndWhistle renderIn={renderPlayer} title={OPTIONS_CHALLENGES.acting.title} description={OPTIONS_CHALLENGES.acting.description}/>)
        break;
      case WHISTLE_SONG:
        setComponentChallenge(<ActingAndWhistle renderIn={renderPlayer} title={OPTIONS_CHALLENGES.whistle_song.title} description={OPTIONS_CHALLENGES.whistle_song.description}/>)
        break;
      case WORD_CHAIN:
        setComponentChallenge(<ChainWordChallengeState><ChainWord renderIn={renderPlayer} dataPlayer={dataChallenge.player}/></ChainWordChallengeState>)
        break;
      case PICTIONARY:
        setComponentChallenge(<Pictionary />)
        break;
      case TRIVIA:
        setComponentChallenge(<Trivia />)
        break;
      case HUNGED:
        setComponentChallenge(<HungedChallengeState><Hunged renderIn={renderPlayer}/></HungedChallengeState>)
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
  }, [dataChallenge])


  return (
    <div>
      { activeChallenge && 
      <>
        <h2>Pasa el reto para poder avanzar</h2>
        {renderPlayer == 'ADMIN' && <Chronometer data={dataChallenge}/>}
        {componentChallenge}        
      </>
      }
    </div>
  )
}

export default BoardChallenges
