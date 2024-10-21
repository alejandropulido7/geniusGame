import React, { useState, useEffect, useContext } from 'react'
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import Chronometer from './Chronometer';
import {ACTING, BACK_HOME, WORD_CHAIN, HUNGED, PICTIONARY, TRIVIA, WHISTLE_SONG, OPTIONS_CHALLENGES, RENDER_CHALLENGE, TRIVIA_VS} from '../../utils/constants'
import Hunged from './hunged/Hunged';
import ChainWord from './chainWords/ChainWords';
import Pictionary from './pictionary/Pictionary';
import Trivia from './trivia/Trivia';
import { GlobalContext } from '../../context/GlobalContext';
import Acting from './acting/Acting';
import Whistle from './whistle/Whistle';
import { getCookie } from '../../utils/cookies';
import {getSession} from '../../services/sessionService';
import './BoardChallenges.css'
import BackHome from './back-home/BackHome';
import { SocketContext } from '../../context/SocketProvider';
import Trivia_VS from './trivia-versus/Trivia_VS';

const BoardChallenges = ({setOpenModal, setOpenModalRoulette}) => {

  const [componentChallenge, setComponentChallenge] = useState(null);
  const {activeChallenge, setActiveChallenge, dataChallenge, setDataChallenge, renderPlayer, setRenderPlayer} = useContext(GlobalContext);
  const {idRoom} = useParams();
  const {socket} = useContext(SocketContext)

  useEffect(() => {
    getSession(idRoom)
      .then((session) => {
        if(session.challenge_active){
          const active = session.challenge_active;
          setActiveChallenge(active);
          const challengeData = {
            challenge: session.challenge_name,
            participants: JSON.parse(session.challenge_participants)
          }
          setDataChallenge(challengeData);
          renderDevice(challengeData);
        }
      });

  },[]);

  useEffect(() => {
    if(socket){
      socket.on('renderChallenge', (dataChallengeSocket) => {
        setOpenModal(false);
        setOpenModalRoulette(false);
        console.log('dataChallengeSocket', dataChallengeSocket)
        if(dataChallengeSocket.challenge != ''){
          setActiveChallenge(true);
          setDataChallenge(dataChallengeSocket); 
          renderDevice(dataChallengeSocket);
        }
      });
  
      return () => {
        socket.off('renderChallenge');
      }
    }
  },[socket])

  useEffect(() => {

    switch (dataChallenge.challenge) {
      case ACTING:
        setComponentChallenge(<Acting renderIn={renderPlayer}/>)
        break;
      case WHISTLE_SONG:
        setComponentChallenge(<Whistle renderIn={renderPlayer}/>)
        break;
      case WORD_CHAIN:
        setComponentChallenge(<ChainWord renderIn={renderPlayer} dataPlayer={dataChallenge.participants.player}/>)
        break;
      case PICTIONARY:
        setComponentChallenge(<Pictionary renderIn={renderPlayer}/>)
        break;
      case TRIVIA:
        setComponentChallenge(<Trivia renderIn={renderPlayer} dataTrivia={dataChallenge.trivia}/>)
        break;
      case TRIVIA_VS:
        setComponentChallenge(<Trivia_VS renderIn={renderPlayer} dataChallenge={dataChallenge}/>)
        break;
      case HUNGED:
        setComponentChallenge(<Hunged renderIn={renderPlayer} dataPlayer={dataChallenge.participants.player}/>)
        break;  
      case BACK_HOME:
        setComponentChallenge(<BackHome/>)
        break; 
      default:
        setComponentChallenge(null)
        break;
    }
  }, [dataChallenge, renderPlayer]);


  const renderDevice = (data) => {
    const idDevice = getCookie('idDevice-GG');
    switch (idDevice) {
      case data.participants.player.idTeam:
        setRenderPlayer(RENDER_CHALLENGE.player);
      break;
      case data.participants.playerOpponent.idTeam:
        setRenderPlayer(RENDER_CHALLENGE.opponent); 
      break;
      case data.participants.board:
        setRenderPlayer(RENDER_CHALLENGE.admin);
      break;
    }
  }


  return (
    <>
      { activeChallenge && 
      <div className='steps-center-container p-2 challenges-container bg-white'>
        <div className='flex flex-col relative'>
          {renderPlayer == 'ADMIN' && 
          <div className='challenges-top'>
            <Chronometer data={dataChallenge}/>
          </div>}
          {componentChallenge}        
        </div>
      </div>
      }
    </>
  )
}

export default BoardChallenges
