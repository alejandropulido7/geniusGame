import React, { useState, useEffect, useContext, useRef } from 'react';
import {findFlagProperties, FLAGS, getRandomObject, OPTIONS_CHALLENGES } from '../../utils/constants'
import StepsBoard from './StepsBoard';
import {getSession} from '../../services/sessionService';
import {useParams, useNavigate} from 'react-router-dom';
import BoardChallenges from '../challenges/BoardChallenges';
import DataGame from './DataGame';
import { GlobalContext } from '../../context/GlobalContext';
import Modal from '../common/modal/Modal';
import InfoModal from '../common/modal/InfoModal';
import Roulette from '../challenges/common/Roulette';
import Winner from '../challenges/common/Winner';
import './Board.css';
import { SocketContext } from '../../context/SocketProvider';
import { AudioContext } from '../../context/AudioProvider';
import { VideoGainFlags } from '../challenges/common/VideoGainFlags';
import KeepAwakeComponent from '../common/KeepAwakeComponent';
import background_game from '../../assets/audio/background_game-3.mp3';
import move_piece from '../../assets/audio/move-piece-1.mp3';
import steal_flag from '../../assets/audio/gain-flag.mp3';
import trivia_vs_audio from '../../assets/audio/trivia-vs.mp3';
import gain_flag from '../../assets/audio/steal-flag.mp3';
import winner_game from '../../assets/audio/winner-game.mp3';
import lose_challenge from '../../assets/audio/lose-challenge.mp3';
import time from '../../assets/audio/time.mp3';
import render_challenge_audio from '../../assets/audio/render_challenge.mp3';

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [playersPositions, setPlayersPositions] = useState([]);
  const {idRoom} = useParams();
  const navigate = useNavigate();
  const {activeChallenge, setActiveChallenge, setDataChallenge, session, setSession } = useContext(GlobalContext);
  const [openModal, setOpenModal] = useState(false);
  const [openModalRoulette, setOpenModalRoulette] = useState(false);
  const [openModalChoiceNewFlag, setOpenModalChoiceNewFlag] = useState(false);
  const [openModalStealFlag, setOpenModalStealFlag] = useState(false);
  const [infoChoiceNewFlag, setInfoChoiceNewFlag] = useState({});
  const [infoModal, setInfoModal] = useState({});
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState({});
  const {socket} = useContext(SocketContext);
  const {playSound, stopSound } = useContext(AudioContext);
  const [flagStoleModal, setFlagStoleModal] = useState('');
  const audioRefBackground = useRef(new Audio(background_game));
  const audioRefPieceMove = useRef(new Audio(move_piece));
  const audioRefGainFlag = useRef(new Audio(gain_flag));
  const audioRefLoseChallenge = useRef(new Audio(lose_challenge));
  const audioRefStealFlag = useRef(new Audio(steal_flag));
  const audioRefTime = useRef(new Audio(time));
  const audioRefTriviaVersus = useRef(new Audio(trivia_vs_audio));
  const audioRefRenderChallenge = useRef(new Audio(render_challenge_audio));

  useEffect(() => {
    getSessionCreated(idRoom); 
    return () => {
      stopSound(audioRefBackground, 0.07, true);
    }
  },[socket]);

  useEffect(() => {      

    if(socket){
      socket.on('winGame', (data) => {  
        setGameFinished(true);  
        setWinner(data)
      });

      socket.on('throwDice', (data) => {   
        if(data.shouldMove){
          stepByStep(data);
        } else {
          socket.emit('turnOf', {player: data.playermoved}); 
        }
      });
  
      socket.on('renderChallenge', (data) => {
        setOpenModalRoulette(false);
        setOpenModal(false);
        setOpenModalChoiceNewFlag(false); 
      });

      socket.on('status', (data) => {  
        console.log('STATUS: ', data)
    });
      
      socket.on('resultChallenge', (data) => { 
        setOpenModalChoiceNewFlag(false); 
        setDataChallenge({});
        setActiveChallenge(false);
        setOpenModalRoulette(false);
        setPlayersPositions(data.players);
        setOpenModal(false);
        localStorage.clear();
        socket.emit('turnOf', data);
      });
  
      socket.on('openModalChoiceNewFlag', (data) => {
        setOpenModalChoiceNewFlag(true);
        setInfoChoiceNewFlag(data.player);
        setFlagPositions(data.changePositions);
      });

      
  
      socket.on('playerJoinedRoom', (playersInSession) => {
        setPlayersPositions(playersInSession);
      });

      return () => {
        socket.off('throwDice');
        socket.off('resultChallenge');
      }
    }

  }, [socket, openModalChoiceNewFlag, playersPositions, flagPositions, gameFinished, winner]);

  useEffect(() => {
      let timer = null;
      socket?.on('openModalGainFlag', (data) => {
        setFlagStoleModal(data.flag);
        setInfoChoiceNewFlag(data.player);
        console.log('data.player', data.player);
        
        timer = setTimeout(() => {
          setOpenModalStealFlag(false);
        }, 7000);
        setOpenModalStealFlag(true);
      });

      return () => {
        clearTimeout(timer);
      }

  }, [socket])

  

  const stepByStep = (data) => {
    
    const playersInSession = data.players;
    const playerModified = {...data.playermoved};
    let step = playerModified.prev_position;      
    const playerWithChallenge = validateIfPositionHaveChallenge(playerModified);
    const isLastStep = data.isLastStep;

    const intervalo = setInterval(() => {
      if(step < playerModified.positionActive){
        playSound(audioRefPieceMove, 0.5, false, 4);
        step = step + 1;
        playerModified.step = step;
        const playerNewPosition = playersInSession.map(player => player.teamName == playerModified.teamName ? {...player, prev_position: playerModified.prev_position, positionActive: step, step} : player);
        setPlayersPositions(playerNewPosition);
      } else {
        clearInterval(intervalo);
        if((playerWithChallenge && playerWithChallenge.challenge != '') || isLastStep){
          playSound(audioRefRenderChallenge, 1);
          playerWithChallenge.isLastStep = isLastStep;
          if(isLastStep){
            socket.emit('openModalRoulette', { function: 'rendering', data: playerWithChallenge});
            setOpenModalRoulette(true);
          } else {
            setTimeout(() => {
              socket.emit('openModalConfirmation', playerWithChallenge);
              setInfoModal(playerWithChallenge.challenge);
              setOpenModal(true);
            }, 900);
          }
        } else {
          socket.emit('turnOf', {player: playerWithChallenge.player});          
        }       
      }
    }, 700);
  }

  const validateIfPositionHaveChallenge = (playerModified) => {
    const flagBoard = flagPositions.find(board => board.flag == playerModified.flagActive);
    let playerChallenge = {};
    if(flagBoard){
      playerChallenge = flagBoard.positions.find(position => position.position == playerModified.positionActive);
    }
    let ongoingChallenge = {};
    if(playerChallenge){
      ongoingChallenge = {
        // challenge: playerChallenge.challenge,
        // challenge: getRandomObject(['word_chain', 'pictionary']),
        // challenge: 'pictionary',
        challenge: 'whistle_song',
        player: playerModified
      };
    }
    return ongoingChallenge;
  }

  const getSessionCreated = (idRoom) => {        
      getSession(idRoom)
      .then(sessionCreated => {
          setSession(sessionCreated);
          let boardPositions = sessionCreated.json_boardPositions;
          setFlagPositions(JSON.parse(boardPositions));
          if(socket){
            socket.emit('createNewGame', {
                gameId: sessionCreated.id, 
                idDevice: sessionCreated.idHost,
                idSocket: socket.id,
                lenghtBoard: sessionCreated.lenght_board, 
                quantityChallenges: sessionCreated.amount_challenges,
                minsToAnswer: sessionCreated.min_to_answer
            });
          }
      }).catch(()=>{
          navigate('../../board');
      });      
  }

  const classNameSteps = (index) => {
    switch (index) {
      case 0:
        return 'row top';
      case 1:
        return 'column-reverse left';
      case 2:
        return 'row-reverse bottom';
      case 3:
        return 'column right';
      default:
        break;
    }
  }

  function activeSound(){
    playSound(audioRefBackground, 0.4);
    playSound(audioRefPieceMove, 0);
    playSound(audioRefGainFlag, 0);
    playSound(audioRefLoseChallenge, 0);
    playSound(audioRefStealFlag, 0);
    playSound(audioRefTime, 0);
    playSound(audioRefTriviaVersus, 0);
  }

  return (
    <div className='board-container px-20'>
      <KeepAwakeComponent/>
      {
        !gameFinished 
        ?
        <div>
          <div className='steps-container'>
            { flagPositions.map((flagPosition, index) => {
              return <StepsBoard stlyeClass={classNameSteps(index)} key={flagPosition.flag} arrayPositions={flagPosition.positions} flag={flagPosition.flag} players={playersPositions}/>
            })} 
            <DataGame activeSound={activeSound}/>
            <BoardChallenges setOpenModal={setOpenModal} setOpenModalRoulette={setOpenModalRoulette}/>
          </div>
        </div>
        :
        <Winner winner={winner}/>
      }
      <Modal open={openModal} onClose={setOpenModal}>
        <div className='p-6'>
          <InfoModal idChallenge={infoModal}/>
        </div>
      </Modal>
      <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
        <div className='p6'>
          <Roulette/>
        </div>
      </Modal>
      <Modal open={openModalChoiceNewFlag} onClose={setOpenModalChoiceNewFlag}>
        {openModalChoiceNewFlag && 
          <VideoGainFlags audio={audioRefGainFlag} flagGained={infoChoiceNewFlag.flagActive} infoPlayer={infoChoiceNewFlag} waitForOpponent={true}/>
        }
      </Modal>
      <Modal open={openModalStealFlag} onClose={setOpenModalStealFlag}>
        {openModalStealFlag && 
          <VideoGainFlags audio={audioRefGainFlag} flagGained={flagStoleModal} infoPlayer={infoChoiceNewFlag}/>
        }
      </Modal>
    </div>
  );
};

export default BoardGame;