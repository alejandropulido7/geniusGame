import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../common/modal/Modal';
import AdminT from './AdminT_VS';
import PlayerChallengeT from './PlayerChallengeT_VS';
import OpponentInteractiveT from './OpponentInteractiveT_VS';
import OthersPlayersT from './OthersPlayersT_VS';
import {RENDER_CHALLENGE, findFlagProperties} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';
import PositionsTable from './PositionsTable';
import { getCookie } from '../../../utils/cookies';
import StealFlag from '../common/StealFlag';
import { AudioContext } from '../../../context/AudioProvider';
import Confetti from 'react-confetti'

const Trivia_VS = ({renderIn, dataChallenge}) => {
  const [render, setRender] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState('');
  const [buttonModal, setButtonModal] = useState('');
  const [passChallenge, setPassChallenge] = useState(false);
  const [scorePlayers, setScorePlayers] = useState([]);
  const {socket} = useContext(SocketContext);
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState(null);
  const [playersHaveAnswered, setPlayersHaveAnswered] = useState([]);
  const [isRunningTrivia, setIsRunningTrivia] = useState(false);
  const [isLastTurnTrivia , setIsLastTurnTrivia] = useState(false);
  const [dataTrivia, setDataTrivia] = useState({});
  const [playerPunisher, setPlayerPunisher] = useState({});
  const [flagStole, setFlagStole] = useState('');
  const [playerOpponent, setPlayerOpponent] = useState('');
  const {audioRefTriviaVersus, audioRefStealFlag, playSound, stopSound} = useContext(AudioContext);

  useEffect(() => {
    const properties = JSON.parse(localStorage.getItem('trivia-vs-GG'));
    if(properties != null){
        setCategory(properties.category);
        setOptions(properties.options);
        setCurrentQuestion(properties.currentQuestion);
        setCorrectAnswer(properties.correctAnswer);
        setScorePlayers(properties.scorePlayers);
        setRound(properties.round);
        setIsRunningTrivia(properties.isRunningTrivia);
        setWinner(properties.winner);
        setOpenModal(properties.openModal);
    }
  },[])


  useEffect(() => {
    playSound(audioRefTriviaVersus, 0.5, false);
    socket?.on('trivia-versus', (data) => {
      let newTimesPlayers = playersHaveAnswered;

      const countCorrectAnswers = data.data.response == data.data.correctAnswer ? 1 : 0;
      const dataPlayerAnswered = {player: data.player, round: data.data.round, timeResponse: data.data.milliseconds, rightAnswers: countCorrectAnswers};
      newTimesPlayers.push(dataPlayerAnswered);
      

      let positionPlayer = {};
      if(newTimesPlayers.length > 1){       
        newTimesPlayers.forEach((playerElement) => {
          const { player, round, timeResponse, rightAnswers } = playerElement;

          if (!positionPlayer[player.teamName]) {
            positionPlayer[player.teamName] = { timeResponse: 0, rightAnswers: 0, round: 0};
          }

          positionPlayer[player.teamName].round = round;
          positionPlayer[player.teamName].player = player;
          positionPlayer[player.teamName].timeResponse += timeResponse;
          positionPlayer[player.teamName].rightAnswers += rightAnswers;
        })
      }

      const tablePositions = Object.keys(positionPlayer).map((teamName) => ({
        teamName,
        player: positionPlayer[teamName].player,
        timeResponse: (positionPlayer[teamName].timeResponse / 1000).toFixed(2),
        rightAnswers: positionPlayer[teamName].rightAnswers
      }));

      
      const orderTable = tablePositions.sort((a, b) => {
        if(a.rightAnswers !== b.rightAnswers){
          return b.rightAnswers - a.rightAnswers;
        }
        return a.timeResponse - b.timeResponse;
      });      

      setScorePlayers(orderTable);


      if(data.data.round < 3){
        if(data.isLastTurnTrivia == true){          
          setRound(prev => prev+1);
          handlerDataTrivia(data.newQuestion);
          setIsRunningTrivia(true);
        }
      } else if(data.isLastTurnTrivia == true){
        stopSound(audioRefTriviaVersus);
        if(orderTable[0].rightAnswers == 0 && orderTable[1].rightAnswers == 0){
          setWinner(null);
        } else {
          setWinner(orderTable[0].player);
        }
        setOpenModal(true);
      }
    });

  },[socket]);


  useEffect(() => {
    setDataTrivia(dataChallenge.trivia);
    setPlayerPunisher(dataChallenge.participants.player);
    setPlayerOpponent(dataChallenge.dataOpponent.opponentSelected);
  }, [dataChallenge]);


  useEffect(() => {
    if(round == 1){
      handlerDataTrivia(dataChallenge.trivia);
      setIsRunningTrivia(true);
    }
  },[])


  useEffect(() => {

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminT category={category} options={options} currentQuestion={currentQuestion} scorePlayers={scorePlayers}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeT round={round} options={options} correctAnswer={correctAnswer} isRunning={isRunningTrivia} setIsRunning={setIsRunningTrivia}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<PlayerChallengeT round={round} options={options} correctAnswer={correctAnswer} isRunning={isRunningTrivia} setIsRunning={setIsRunningTrivia}/>);
      break;
      default:
        setRender(<OthersPlayersT correctAnswer={correctAnswer}/>);
      break;
    } 

    localStorage.setItem('trivia-vs-GG', JSON.stringify({category, options, currentQuestion, correctAnswer, scorePlayers, round, isRunningTrivia, winner, openModal}));

    return () => {
      localStorage.clear();
    }

  }, [renderIn, category, options, currentQuestion, correctAnswer, scorePlayers, round, isRunningTrivia, winner, openModal]);

  const handlerDataTrivia = (data_trivia) => {
    if(data_trivia){
        setCategory(data_trivia.category);
        setCurrentQuestion(data_trivia.question);
        setOptions(data_trivia.options);
        setCorrectAnswer(data_trivia.correctAnswer);
      }
  }
  
  const nobodyWon = () => {
    socket?.emit('resultChallenge', {player: playerPunisher, challengePassed: false});
  }

  const showResult = () => {
    const flagStolePunisher = dataChallenge.dataOpponent.flagStole;
    if(playerPunisher.idTeam == winner.idTeam){
      if(flagStolePunisher == ''){
        return <p>El equipo {playerOpponent.teamName} no tiene banderas, asi que el equipo {playerPunisher.teamName} conserva su posicion</p>;
      } else {
        return <div>
          <Confetti/>
          <p>El equipo {playerPunisher.teamName} ha robado la bandera {findFlagProperties(flagStolePunisher).name}</p>;
        </div>
      }
    } else if(playerOpponent.idTeam == winner.idTeam){
      if(playerPunisher.flagsObtained.length > 0){
        return <div>
          <Confetti/>
          <StealFlag flagStole={flagStole} setFlagStole={setFlagStole} flagsOpponent={playerPunisher.flagsObtained}/>
        </div>
      } else {
        return <p>El equipo {playerPunisher.teamName} no tiene banderas, se regresa a la posicion anterior</p>
      }
    }
  }

  const emitWinner = () => {
    const data = {
      playerPunisher, 
      winner, 
      opponent: dataChallenge.dataOpponent.opponentSelected,
      flagStole: dataChallenge.dataOpponent.flagStole
    }

    if(playerOpponent.idTeam == winner.idTeam){
      data.flagStole = flagStole;
    }

    socket?.emit('stealFlag', data);
    socket?.emit('openModalGainFlag', {winner, flag: data.flagStole});
    
  }

  return (
    <div className='m-auto'>
      <div>
        <p className='text-xl font-bold'>
          Ronda {round}/3
        </p>
      </div>
      <div>
        <p>Equipo retador: {playerPunisher.teamName}</p>
      </div>
      <div className='w-full my-5'>
          <div className=''>
            {render}
          </div>
      </div>      
      <Modal open={openModal} onClose={setOpenModal}>
          <div className='flex justify-between flex-col'>
            {renderIn == RENDER_CHALLENGE.admin && <PositionsTable positionTable={scorePlayers}/>}            
            {(winner != null) &&
              <div>
                <p>El equipo ganador es: {winner.teamName}</p>                
                {winner.idTeam == getCookie('idDevice-GG') && 
                <div>
                  {playSound(audioRefStealFlag, 0.5, false)}
                  <div>
                    {showResult()}
                  </div>
                  <button onClick={emitWinner} className='btn my-5 bg-blue-600 shadow-sm text-white shadow-black'>Avanzar</button>
                </div>
                }
              </div>
            }
            {(winner == null) &&
              <div>
                <p>No ha ganado ningun equipo, el equipo {playerPunisher.teamName} se devuelve a la casilla anterior </p>
                {playerPunisher.idTeam == getCookie('idDevice-GG') && 
                <button onClick={nobodyWon} className='btn my-5 bg-red-600 shadow-sm text-white shadow-black'>Retroceder</button>}
              </div>
            }
          </div>
      </Modal>  
    </div>
  );
};

export default Trivia_VS;
