import React, { useState, useEffect, useContext } from 'react';
import {FLAGS } from '../../utils/constants'
import {CHALLENGES_IN_BOARD, getRandomObject, ACTING} from '../../utils/constants'
import StepsBoard from './StepsBoard';
import socket from '../../config/socket';
import {updateBoardPositions, getSession} from '../../services/sessionService';
import {useParams, useNavigate} from 'react-router-dom';
import BoardChallenges from '../challenges/BoardChallenges';
import DataGame from './DataGame';
import { GlobalContext } from '../../context/challenges/GlobalContext';

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [session, setSession] = useState({})
  const [playersPositions, setPlayersPositions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); 
  const [flags, setFlags] = useState(FLAGS);
  const {idRoom} = useParams();
  const [configBoard, setConfigBoard] = useState({
      lenghtBoard: 17,
      quantityChallenges: 5
  });
  let boardSteps = [];
  const navigate = useNavigate();
  const {activeChallenge, setActiveChallenge, setDataChallenge } = useContext(GlobalContext);
   

  useEffect(() => { 
    getSessionCreated(idRoom);   

    socket.on('throwDice', (data) => {      
      stepByStep(data);
    });
    
    socket.on('resultChallenge', (data) => {    
      setDataChallenge({});
      setActiveChallenge(false);
      setPlayersPositions(data.players);
      localStorage.clear();
      socket.emit('turnOf', data);
    });

    return () => {
      socket.off('throwDice');
      socket.off('resultChallenge');
      setFlagPositions([]);
      setSession({});
      setGameStarted(false);
    }
  }, [activeChallenge]);

  socket.on('playerJoinedRoom', (playersInSession) => {
    setPlayersPositions(playersInSession);
  }); 


  const stepByStep = (data) => {
    
    const playersInSession = data.players;
    const playerModified = {...data.playermoved};
    let step = playerModified.prev_position;      
    const playerWithChallenge = validateIfPositionHaveChallenge(playerModified);

    const intervalo = setInterval(() => {
      if(step < playerModified.positionActive){
        step = step + 1;
        playerModified.step = step;
        console.log('Intervalo ejecutándose: '+playerModified.step);
        const playerNewPosition = playersInSession.map(player => player.teamName == playerModified.teamName ? {...player, prev_position: playerModified.prev_position, positionActive: step, step} : player);
        setPlayersPositions(playerNewPosition);
      } else {
        clearInterval(intervalo);
        if(playerWithChallenge && playerWithChallenge.challenge != ''){
          setTimeout(() => {
            setActiveChallenge(true);
            localStorage.setItem('activeChallenge-GG', true);
            setDataChallenge(playerWithChallenge);
            socket.emit('renderChallenge', playerWithChallenge);
          }, 700);
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
        challenge: 'acting',
        player: playerModified
      };
    }
    return ongoingChallenge;
  }

  const getSessionCreated = async (idRoom) => {        
      getSession(idRoom)
      .then(sessionCreated => {
          setSession(sessionCreated);
          setGameStarted(sessionCreated.gameStarted);
          let boardPositions = sessionCreated.json_boardPositions;
          if( boardPositions != ''){
            setFlagPositions(JSON.parse(boardPositions));
          } else {
            inizializeSteps(idRoom);  
          } 
          socket.emit('createNewGame', {
              gameId: sessionCreated.id, 
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
      addflagPositions.push({flag: flag, positions: generateNewSteps(newPositions)});
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
        positionsChallenges = positionsChallenges.map(item => item.position == random && (random > 1 && random != configBoard.lenghtBoard) ? {...item, challenge: getRandomObject(CHALLENGES_IN_BOARD)} : item);
      }
      return positionsChallenges;
  }

  return (
    <div>
      <div>
          <h3>Game configuration</h3>
      </div>
      <DataGame playersPositions={playersPositions} session={session} startGame={gameStarted} setStartGame={setGameStarted}/>
      { !activeChallenge && <div>
        { flagPositions.map(flagPosition => {
          return <StepsBoard key={flagPosition.flag} arrayPositions={flagPosition.positions} flag={flagPosition.flag} players={playersPositions}/>
        })} 
      </div>}
      <BoardChallenges/>
    </div>
  );
};

export default BoardGame;