import React, { useState, useEffect } from 'react';
import {FLAGS } from '../../utils/constants'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import StepsBoard from './StepsBoard';
import socket from '../../config/socket';
import {updateBoardPositions, getSession} from '../../services/sessionService';
import {useParams, useNavigate} from 'react-router-dom';
import ContainerChallenges from '../challenges/ContainerChallenges';
import DataGame from './DataGame';

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [session, setSession] = useState({})
  const [playersPositions, setPlayersPositions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); 
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [flags, setFlags] = useState(FLAGS);
  const {idRoom} = useParams();
  const navigate = useNavigate();
  const [configBoard, setConfigBoard] = useState({
      lenghtBoard: 10,
      quantityChallenges: 5
  });
   

  useEffect(() => { 
    getSessionCreated(idRoom);       

    socket.on('throwDice', (playersUpdated) => {
      console.log(playersPositions)
      setPlayersPositions(playersUpdated)
    });
    
    return () => {
      socket.off('throwDice');
      setFlagPositions([]);
    }
  }, []);

  socket.on('playerJoinedRoom', (playersInSession) => {
    setPlayersPositions(playersInSession);
  });  

  const getSessionCreated = async (idRoom) => {        
      getSession(idRoom)
      .then(sessionCreated => {
          if(sessionCreated){
              setSession(sessionCreated);
              setGameStarted(sessionCreated.gameStarted);
              const boardPositions = sessionCreated.json_boardPositions;
              if( boardPositions != ''){
                setFlagPositions(JSON.parse(boardPositions));
              } else {
                inizializeSteps(idRoom);  
              } 
              socket.emit('createNewGame', {
                  gameId: sessionCreated.id, 
                  lenghtBoard: configBoard.lenghtBoard, 
                  quantityChallenges: configBoard.quantityChallenges
              });
          } else {
              navigate('../room');
          }
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
      console.log('addflagPositions GENERADA');
      console.log(addflagPositions);
      setFlagPositions(addflagPositions); 
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
      { !isChallengeActive && <div>
        { flagPositions.map(flagPosition => {
          return <StepsBoard key={flagPosition.flag} arrayPositions={flagPosition.positions} flag={flagPosition.flag} players={playersPositions}/>
        })} 
      </div>}
      <ContainerChallenges setActiveChallenge={setIsChallengeActive}/>
    </div>
  );
};

export default BoardGame;