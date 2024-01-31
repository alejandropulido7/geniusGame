import React, { useState, useEffect } from 'react';
import {FLAGS } from '../../utils/constants'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import StepsBoard from './StepsBoard';
import socket from '../../config/socket';
import {updateBoardPositions, getSession} from '../../services/sessionService';
import {useParams, useNavigate} from 'react-router-dom';

const BoardGame = () => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [session, setSession] = useState({})
  const [playersPositions, setPlayersPositions] = useState([]); 
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
              const boardPositions = sessionCreated.json_boardPositions;
              if( boardPositions != ''){
                setFlagPositions(JSON.parse(boardPositions));
              } else {
                inizializeSteps();  
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
  
  const inizializeSteps = async () => {
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
      const savePositions = JSON.stringify(addflagPositions);
      await updateBoardPositions(savePositions, session.id);
      setFlagPositions(addflagPositions); 
    } 
  };

  const generateNewSteps = (array) => {
    let positionsChallenges = [...array]
    for (let index = 0; index < configBoard.quantityChallenges; index++) {
        const random = Math.floor(Math.random() * configBoard.lenghtBoard) + 1;
        positionsChallenges = positionsChallenges.map(item => item.position == random && random > 1 ? {...item, challenge: getRandomObject(CHALLENGES_IN_BOARD)} : item);
      }
      return positionsChallenges;
  }

  const readyToPlay = () => {
    socket.emit('startGame')
  }

  return (
    <div>
      <div>
          <h3>Game configuration</h3>
          <h4>{codeSession}</h4>
          <p>Minutes to answer: {session.min_to_answer}</p>
      </div>
      <button onClick={readyToPlay}>Ready to play</button>
      <h1>Tablero de Escalera</h1>
      {
          playersPositions.map((player) => {
              return (
                  <div key={player.teamName}>
                      <h3>{player.teamName} - {player.positionActive}</h3>
                  </div>
              )
          })
      }
      { flagPositions.map(flagPosition => {
        return <StepsBoard key={flagPosition.flag} arrayPositions={flagPosition.positions} flag={flagPosition.flag} players={playersPositions}/>
      })} 
    </div>
  );
};

export default BoardGame;