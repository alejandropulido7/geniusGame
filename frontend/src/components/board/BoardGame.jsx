import React, { useState, useEffect } from 'react';
import {FLAGS } from '../../utils/constants'
import {CHALLENGES_IN_BOARD, getRandomObject} from '../../utils/constants'
import StepsBoard from './StepsBoard';
import socket from '../../config/socket'
import {updatePositionTeam} from '../../services/teamService';

const BoardGame = ({players}) => {
  const [flagPositions, setFlagPositions] = useState([]);
  const [posicionJugador, setPosicionJugador] = useState(1);
  const [playersPositions, setPlayersPositions] = useState([]); 
  const [flags, setFlags] = useState(FLAGS)

  const LENGTH_BOARD = 10;
  const QUANTITY_CHALLENGES = 5;

  useEffect(() => { 
    //TODO: Consultar de BD
    const flagPositionsSaved = localStorage.getItem('positions-GG');
    if(flagPositionsSaved){
      setFlagPositions(JSON.parse(flagPositionsSaved));
    } else {
      inizializeSteps();  
    }
  }, []);

  const inizializePlayers = () => {
    const teams = [];
    players.map(player => {
      teams.push({teamName: player.teamName, flagActive: player.flagActive, position: 1})
    });
    setPlayersPositions(teams);
  }
  
  const inizializeSteps = () => {
    const positionsBoard = Array.from({ length: LENGTH_BOARD }, (_, index) => index + 1);      
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
      //TODO: Guardar en BD
      localStorage.setItem('positions-GG', JSON.stringify(addflagPositions));
    } 
  };

  const generateNewSteps = (array) => {
    let positionsChallenges = [...array]
    for (let index = 0; index < QUANTITY_CHALLENGES; index++) {
        const random = Math.floor(Math.random() * LENGTH_BOARD) + 1;
        positionsChallenges = positionsChallenges.map(item => item.position == random && random > 1 ? {...item, challenge: getRandomObject(CHALLENGES_IN_BOARD)} : item);
      }
      return positionsChallenges;
  }

  socket.on('playerJoinedRoom', (players) => {
    const teams = [];
    players.map(player => {
      teams.push({teamName: player.teamName, flagActive: player.flagActive, position: player.positionActive})
    });
    setPlayersPositions(teams);
  });

  

  socket.on('throwDice', (data) => {
      const playerMoved = playersPositions.find(player => player.teamName === data.teamName);
      if(playerMoved){
        const newPosition = playerMoved.position + data.diceValue;
        if(newPosition <= LENGTH_BOARD){
          const playerNewPosition = playersPositions.map(player => player.teamName == data.teamName ? {...player, position: newPosition} : player);
          updatePositionPlayer(data, newPosition);    
          setPlayersPositions(playerNewPosition);
        } else {
          return
        }

      }
  });

  async function updatePositionPlayer(data, newPosition){
    const updatePositionPlayer = await updatePositionTeam(data.teamName, data.gameId, data.flagActive, newPosition);
    return updatePositionPlayer;
  }
  
  console.log(playersPositions)

  return (
    <div>
      <h1>Tablero de Escalera</h1>
      {
          playersPositions.map((player) => {
              return (
                  <div key={player.teamName}>
                      <h3>{player.teamName} - {player.position}</h3>
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