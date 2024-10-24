import React, { useContext, useEffect, useState } from 'react';
import KeyboardCW from './KeyboardCW'
import { getTeamByName } from '../../../services/teamService';
import { SocketContext } from '../../../context/SocketProvider';

const PlayerChallengeCW = ({lastWord, dataPlayer}) => {

    const [arrayWords, setArrayWords] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teammate, setTeammate] = useState('');
    const [indexTeammate, setIndexTeammate] = useState(0);
    const [finishChallenge, setFinishChallenge] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [showNotPassChallenge, setShowNotPassChallenge] = useState(false);
    const [previousPosition, setPreviousPosition] = useState(0);
    const [opponentValidation, setOpponentValidation] = useState(false);
    const [newWord, setNewWord] = useState('');
    const {socket} = useContext(SocketContext);

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
      getTeamByName(dataPlayer.teamName, dataPlayer.gameId)
      .then(team => {
        const players = JSON.parse(team.players);
        setTeamPlayers(players);
        setTeammate(players[indexTeammate]);
      });
    }, []);

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

      socket?.on('startChallenge', (data) => {
        setShowKeyboard(true);
      });

      socket?.on('notPassChallenge', (data) => {
        if(data.socketId == socket?.id){
          setShowNotPassChallenge(true);
          setShowKeyboard(false);
          setPreviousPosition(data.prev_position);
        }
      });

    },[socket, teamPlayers, newWord, finishChallenge, teammate, indexTeammate, lastWord]);

    const manageNewWord = () => {
      if (newWord && (!lastWord || newWord.charAt(0).toLowerCase() === lastWord.slice(-1).toLowerCase())) {
        const wordList = JSON.parse(JSON.stringify(arrayWords));
        wordList.push(newWord);
        setNewWord('');
        setArrayWords(wordList);
        socket?.emit('chainWords', {lastWord: newWord, wordList, socketId: socket?.id});
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
      socket?.emit('stopChallenge', {socketId: socket?.id});
    }

    const notPassChallenge = () => {
      socket?.emit('resultChallenge', {player: dataPlayer, challengePassed: false});
    }
  
    return (
      <div>
        {!finishChallenge 
        ? <div>
            <h4 className='text-red-600 text-xl'>Turno de <span className='uppercase underline'>{teammate}</span></h4>
            <p>Ultima palabra: {lastWord}</p>
            {showKeyboard && 
            <div className='block'>
              <KeyboardCW texto={newWord} setTexto={setNewWord}/>
              <button className='btn bg-green-600 text-white' onClick={manageNewWord}>Agregar Palabra</button>
            </div>}
          </div> 
        : 
        <div className='flex flex-col gap-5'>
          {(!opponentValidation && !showNotPassChallenge) 
          ?
          <div>
            <p>Haz clic en Finalizar antes de que se acabe el tiempo!</p>
            <button className='btn' onClick={stopChallenge}>Finalizar</button>
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
            <button className='btn' onClick={notPassChallenge}>Ok</button>
          </div>
        }
      </div>
    )
  }

export default PlayerChallengeCW
