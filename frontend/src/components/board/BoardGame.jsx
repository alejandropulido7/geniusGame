import React, { useState, useEffect, useContext } from 'react';
import {FLAGS, OPTIONS_CHALLENGES } from '../../utils/constants'
import {CHALLENGES_IN_BOARD, getRandomObject, ACTING} from '../../utils/constants'
import StepsBoard from './StepsBoard';
import socket from '../../config/socket';
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

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  // const [session, setSession] = useState({});
  const [playersPositions, setPlayersPositions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); 
  const [flags, setFlags] = useState(FLAGS);
  const {idRoom} = useParams();
  const [configBoard, setConfigBoard] = useState({
      lenghtBoard: 10,
      quantityChallenges: 7
  });
  let boardSteps = [];
  const navigate = useNavigate();
  const {activeChallenge, setActiveChallenge, setDataChallenge, session, setSession } = useContext(GlobalContext);
  const [openModal, setOpenModal] = useState(false);
  const [openModalRoulette, setOpenModalRoulette] = useState(false);
  const [openModalChoiceNewFlag, setOpenModalChoiceNewFlag] = useState(false);
  const [infoChoiceNewFlag, setInfoChoiceNewFlag] = useState({});
  const [infoModal, setInfoModal] = useState({});
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState({});

  useEffect(() => {
    socket.on('winGame', (data) => {  
      setGameFinished(true);  
      setWinner(data)
    });
  },[gameFinished, winner]);

  useEffect(() => {
    getSessionCreated(idRoom); 
  },[activeChallenge, playersPositions]);

  useEffect(() => {      

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
    });
    
    socket.on('resultChallenge', (data) => { 
      console.log('resultChallenge', data)  
      setOpenModalChoiceNewFlag(false); 
      setDataChallenge({});
      setActiveChallenge(false);
      setPlayersPositions(data.players);
      setOpenModal(false);
      localStorage.clear();
      socket.emit('turnOf', data);
    });

    socket.on('openModalChoiceNewFlag', (data) => {
      setOpenModalChoiceNewFlag(true);
      setInfoChoiceNewFlag(data);
    });

    return () => {
      socket.off('throwDice');
      socket.off('resultChallenge');
      setFlagPositions([]);
      setSession({});
    }
  }, [openModalChoiceNewFlag]);

  socket.on('playerJoinedRoom', (playersInSession) => {
    setPlayersPositions(playersInSession);
  }); 


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
              const infoModal = OPTIONS_CHALLENGES.get(playerWithChallenge.challenge);
              setInfoModal(infoModal);
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
    const flagBoard = boardSteps.find(board => board.flag == playerModified.flagActive);
    let playerChallenge = {};
    if(flagBoard){
      playerChallenge = flagBoard.positions.find(position => position.position == playerModified.positionActive);
    }
    let ongoingChallenge = {};
    if(playerChallenge){
      ongoingChallenge = {
        // challenge: playerChallenge.challenge,
        challenge: 'trivia',
        player: playerModified
      };
    }
    return ongoingChallenge;
  }

  const getSessionCreated = async (idRoom) => {        
      getSession(idRoom)
      .then(sessionCreated => {
          setSession(sessionCreated);
          let boardPositions = sessionCreated.json_boardPositions;
          if( boardPositions != ''){
            setFlagPositions(JSON.parse(boardPositions));
          } else {
            inizializeSteps(idRoom);  
          } 
          socket.emit('createNewGame', {
              gameId: sessionCreated.id, 
              idDevice: sessionCreated.idHost,
              idSocket: socket.id,
              lenghtBoard: configBoard.lenghtBoard, 
              quantityChallenges: configBoard.quantityChallenges
          });
      }).catch(()=>{
          localStorage.clear();
          navigate('../room');
      });      
  }
  
  const inizializeSteps = async (idRoom) => {
    const positionsBoard = Array.from({ length: configBoard.lenghtBoard }, (_, index) => index + 1);      
    let newPositions = [];
    let addflagPositions = [];
    positionsBoard.forEach(position => {
      newPositions.push({position: position, challenge: ''});
    });
    flags.map( flag => {
      addflagPositions.push({flag: flag.id, positions: generateNewSteps(newPositions)});
    }); 
    if(addflagPositions.length > 0) {
      setFlagPositions(addflagPositions); 
      boardSteps = addflagPositions;
      const savePositions = JSON.stringify(addflagPositions);
      await updateBoardPositions(savePositions, idRoom);
    } 
  };

  const generateNewSteps = (array) => {
    let positionsChallenges = [...array]
    for (let index = 0; index < configBoard.quantityChallenges; index++) {
      const random = Math.floor(Math.random() * configBoard.lenghtBoard) + 1;
      positionsChallenges = positionsChallenges.map(item => item.position == random && (random > 1 && random != configBoard.lenghtBoard) ? {...item, challenge: getRandomObject(CHALLENGES_IN_BOARD).id} : item);
    }
    return positionsChallenges;
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
        <InfoModal title={infoModal.title} description={infoModal.description}/>
      </Modal>
      <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
        <Roulette/>
      </Modal>
      <Modal open={openModalChoiceNewFlag} onClose={setOpenModalChoiceNewFlag}>
        <h3>Wow! el equipo {infoChoiceNewFlag.teamName} ha ganado la bandera {infoChoiceNewFlag.flagActive}</h3>
        <p>Esperando a que elija su proxima bandera...</p>
      </Modal>
    </div>
  );
};

export default BoardGame;