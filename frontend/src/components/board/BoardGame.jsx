import React, { useState, useEffect, useContext } from 'react';
import {findFlagProperties, FLAGS, OPTIONS_CHALLENGES } from '../../utils/constants'
import StepsBoard from './StepsBoard';
import {updateBoardPositions, getSession} from '../../services/sessionService';
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

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [playersPositions, setPlayersPositions] = useState([]);
  const {idRoom} = useParams();
  const navigate = useNavigate();
  const {activeChallenge, setActiveChallenge, setDataChallenge, session, setSession } = useContext(GlobalContext);
  const [openModal, setOpenModal] = useState(false);
  const [openModalRoulette, setOpenModalRoulette] = useState(false);
  const [openModalChoiceNewFlag, setOpenModalChoiceNewFlag] = useState(false);
  const [infoChoiceNewFlag, setInfoChoiceNewFlag] = useState({});
  const [infoModal, setInfoModal] = useState({});
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState({});
  const {socket} = useContext(SocketContext);

  useEffect(() => {
    getSessionCreated(idRoom); 
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

  

  const stepByStep = (data) => {
    
    const playersInSession = data.players;
    const playerModified = {...data.playermoved};
    let step = playerModified.prev_position;      
    const playerWithChallenge = validateIfPositionHaveChallenge(playerModified);
    const isLastStep = data.isLastStep;

    const intervalo = setInterval(() => {
      if(step < playerModified.positionActive){
        step = step + 1;
        playerModified.step = step;
        const playerNewPosition = playersInSession.map(player => player.teamName == playerModified.teamName ? {...player, prev_position: playerModified.prev_position, positionActive: step, step} : player);
        setPlayersPositions(playerNewPosition);
      } else {
        clearInterval(intervalo);
        if((playerWithChallenge && playerWithChallenge.challenge != '') || isLastStep){
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
        challenge: playerChallenge.challenge,
        // challenge: 'hunged',
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
                quantityChallenges: sessionCreated.amount_challenges
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

  return (
    <div className='board-container px-20'>
      {
        !gameFinished 
        ?
        <div>
          <div className='steps-container'>
            { flagPositions.map((flagPosition, index) => {
              return <StepsBoard stlyeClass={classNameSteps(index)} key={flagPosition.flag} arrayPositions={flagPosition.positions} flag={flagPosition.flag} players={playersPositions}/>
            })} 
            <DataGame/>
            <BoardChallenges setOpenModal={setOpenModal} setOpenModalRoulette={setOpenModalRoulette}/>
          </div>
        </div>
        :
        <Winner winner={winner}/>
      }

      <Modal open={openModal} onClose={setOpenModal}>
        <InfoModal idChallenge={infoModal}/>
      </Modal>
      <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
        <Roulette/>
      </Modal>
      <Modal open={openModalChoiceNewFlag} onClose={setOpenModalChoiceNewFlag}>
        <div className='flex flex-col gap-4'>
          <h3>Wow! el equipo {infoChoiceNewFlag.teamName} ha ganado la bandera {findFlagProperties(infoChoiceNewFlag.flagActive)?.name}</h3>
          <p>Esperando a que elija su proxima bandera...</p>
        </div>
      </Modal>
    </div>
  );
};

export default BoardGame;