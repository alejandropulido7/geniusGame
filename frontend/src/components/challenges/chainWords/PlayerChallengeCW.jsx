import React, { useContext, useEffect, useState } from 'react';
import socket from '../../../config/socket';
import KeyboardCW from './KeyboardCW'
import { getTeamByName } from '../../../services/teamService';

const PlayerChallengeCW = ({lastWord, dataPlayer}) => {

    // const {lastWord, setLastWord} = useState('');
    const [arrayWords, setArrayWords] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teammate, setTeammate] = useState('');
    const [indexTeammate, setIndexTeammate] = useState(0);
    const [finishChallenge, setFinishChallenge] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [showNotPassChallenge, setShowNotPassChallenge] = useState(false);
    const [previousPosition, setPreviousPosition] = useState(0);
    const [opponentValidation, setOpponentValidation] = useState(false);

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('chainWords-player-GG'));
      if(properties != null){
        setNewWord(properties.newWord);
        setArrayWords(properties.arrayWords);
        setTeamPlayers(properties.teamPlayers);
        setTeammate(properties.teammate);
        setIndexTeammate(properties.indexTeammate);
        setFinishChallenge(properties.finishChallenge);
        setShowKeyboard(properties.showKeyboard);
        setShowNotPassChallenge(properties.showNotPassChallenge);
        setPreviousPosition(properties.previousPosition);
        setOpponentValidation(properties.opponentValidation);
      } 
    },[]);

    useEffect(() => {
      localStorage.setItem('chainWords-player-GG', JSON.stringify({
        newWord,
        arrayWords,
        teamPlayers,
        teammate,
        indexTeammate,
        finishChallenge,
        showKeyboard,
        showNotPassChallenge,
        previousPosition,
        opponentValidation}));

    },[newWord,
      arrayWords,
      teamPlayers,
      teammate,
      indexTeammate,
      finishChallenge,
      showKeyboard,
      showNotPassChallenge,
      previousPosition,
      opponentValidation])

    useEffect(() => {

      socket.on('startChallenge', (data) => {
        setShowKeyboard(true);
      });

      socket.on('notPassChallenge', (data) => {
        if(data.socketId == socket.id){
          setShowNotPassChallenge(true);
          setShowKeyboard(false);
          setPreviousPosition(data.prev_position);
        }
      })

      getTeamByName(dataPlayer.teamName, dataPlayer.gameId)
      .then(team => {
        const players = JSON.parse(team.players);
        console.log(players);
        setTeamPlayers(players);
        setTeammate(players[indexTeammate]);
      });

      return () => {
        socket.off('resultChallenge');        
      }
    },[]);

    const manageNewWord = () => {
      if (newWord && (!lastWord || newWord.charAt(0).toLowerCase() === lastWord.slice(-1).toLowerCase())) {
        const wordList = [...arrayWords];
        wordList.push(newWord);
        setNewWord('');
        socket.emit('chainWords', {lastWord: newWord, wordList, socketId: socket.id});
        if(wordList.length == teamPlayers.length){
          setFinishChallenge(true);
        } else {
          const newIndex = indexTeammate + 1;
          setTeammate(teamPlayers[newIndex]);
          setIndexTeammate(newIndex);
        }       
      } else {
        alert('La palabra no cumple con las reglas del juego.');
      }
    };

    const stopChallenge = () => {
      setOpponentValidation(true);
      console.log('dataplayer', dataPlayer);
      socket.emit('stopChallenge', {socketId: socket.id});
    }

    const notPassChallenge = () => {
      socket.emit('resultChallenge', {player: dataPlayer, challengePassed: false});
    }
  
    return (
      <div>
        {!finishChallenge 
        ? <div>
            <h4>Turno de {teammate}</h4>
            {showKeyboard && 
            <div>
              <KeyboardCW texto={newWord} setTexto={setNewWord}/>
              <button className='btn' onClick={manageNewWord}>Agregar Palabra</button>
            </div>}
          </div> 
        : 
        <div>
          {!opponentValidation 
          ?
          <div>
            <p>Haz clic en Finalizar antes de que se acabe el tiempo!</p>
            <button className='btn' onClick={stopChallenge}>Finish</button>
          </div>
          :
          <div>
            <p>Esperando validacion del oponente</p>
          </div>}
        </div>}
        {
          showNotPassChallenge && 
          <div>
            <p>No pasaste el reto, te vamos a devolver a la posicion {previousPosition}</p>
            <button className='btn' onClick={notPassChallenge}>OK</button>
          </div>
        }
      </div>
    )
  }

export default PlayerChallengeCW
