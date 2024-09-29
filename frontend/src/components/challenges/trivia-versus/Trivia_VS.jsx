import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../common/modal/Modal';
import AdminT from './AdminT_VS';
import PlayerChallengeT from './PlayerChallengeT_VS';
import OpponentInteractiveT from './OpponentInteractiveT_VS';
import OthersPlayersT from './OthersPlayersT_VS';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';
import PositionsTable from './PositionsTable';
import { getCookie } from '../../../utils/cookies';

const Trivia_VS = ({renderIn, dataTrivia, playerPunisher}) => {
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
          positionPlayer[player.teamName].timeResponse += timeResponse;
          positionPlayer[player.teamName].rightAnswers += rightAnswers;
        })
      }

      const tablePositions = Object.keys(positionPlayer).map((teamName) => ({
        teamName,
        timeResponse: (positionPlayer[teamName].timeResponse / 1000).toFixed(2),
        rightAnswers: positionPlayer[teamName].rightAnswers
      }));

      
      const orderTable = tablePositions.sort((a, b) => {
        if(a.rightAnswers !== b.rightAnswers){
          return b.rightAnswers - a.rightAnswers;
        }
        return a.timeResponse - b.timeResponse;
      });
      
      console.log(orderTable);
      

      setScorePlayers(orderTable);


      if(data.data.round < 3){
        if(data.isLastTurnTrivia){
          
          setRound(prev => prev+1);    
          console.log('nueva pregunta', data.newQuestion);
          setDataTrivia(data.newQuestion);
          setIsRunningTrivia(true);
        }
      } else if(data.isLastTurnTrivia){
        if(orderTable[0].rightAnswers == 0 && orderTable[1].rightAnswers == 0){
          setWinner(null);
        } else {
          setWinner(orderTable[0].teamName);
        }
        setOpenModal(true);
        setIsRunningTrivia(true);
      }
    });

  },[socket]);


  useEffect(() => {

    if(round == 1){
      setDataTrivia(dataTrivia);
      setIsRunningTrivia(true);
    }

    console.warn('dcorrectAnswer-2', correctAnswer);

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

  const setDataTrivia = (data_trivia) => {
    if(data_trivia){
        setCategory(data_trivia.category);
        setCurrentQuestion(data_trivia.question);
        setOptions(data_trivia.options);
        setCorrectAnswer(data_trivia.correctAnswer);
      }
  }
  
  const sendResult = () => {
    socket?.emit('resultChallenge', {player, challengePassed: passChallenge});
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
                <p>El equipo ganador es: {winner}</p>
                {winner == getCookie('teamName-GG') && <button onClick={sendResult} className='btn'>Avanzar</button>}
              </div>
            }
            {(winner == null) &&
              <div>
                <p>No ha ganado ningun equipo, el equipo {playerPunisher.teamName} se devuelve a la casilla anterior </p>
                {playerPunisher.idTeam == getCookie('idDevice-GG') && <button onClick={sendResult} className='btn'>Retroceder</button>}
              </div>
            }
          </div>
      </Modal>  
    </div>
  );
};

export default Trivia_VS;
