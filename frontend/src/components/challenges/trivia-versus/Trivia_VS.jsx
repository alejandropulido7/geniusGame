import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../common/modal/Modal';
import AdminT from './AdminT_VS';
import PlayerChallengeT from './PlayerChallengeT_VS';
import OpponentInteractiveT from './OpponentInteractiveT_VS';
import OthersPlayersT from './OthersPlayersT_VS';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';

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
    socket?.on('trivia-versus', (data) => {
      let newTimesPlayers = playersHaveAnswered;
      console.warn('data.data.response', data.data.response)
      console.warn('dcorrectAnswer', correctAnswer);

      const countCorrectAnswers = data.data.response == data.data.correctAnswer ? 1 : 0;
      const dataPlayerAnswered = {player: data.player, round: data.data.round, timeResponse: data.data.milliseconds, rightAnswers: countCorrectAnswers};
      newTimesPlayers.push(dataPlayerAnswered);
      // setScorePlayers(newTimesPlayers);


      // setDataTrivia(initialValuesTrivia);

      // let positionPlayer = {};
      // if(newTimesPlayers.length > 0){       
      //   newTimesPlayers.forEach((playerElement) => {
      //     const { player, round, timeResponse, rightAnswers } = playerElement;

      //     if (!positionPlayer[player.teamName]) {
      //       positionPlayer[player.teamName] = { timeResponse: 0, rightAnswers: 0, round: 0};
      //     }

      //     positionPlayer[player.teamName].round = round;
      //     positionPlayer[player.teamName].timeResponse += timeResponse;
      //     positionPlayer[player.teamName].rightAnswers += rightAnswers;
      //   })
      // }

      // const tablePositions = Object.keys(positionPlayer).map((teamName) => ({
      //   teamName,
      //   timeResponse: positionPlayer[teamName].timeResponse,
      //   rightAnswers: positionPlayer[teamName].rightAnswers
      // }));

      // console.warn(tablePositions);

      newTimesPlayers.sort((a, b) => {
        if(a.rightAnswers > b.rightAnswers){
          return a;
        } else if (a.rightAnswers == b.rightAnswers){
          if(a.timeResponse < b.timeResponse){
            return a;
          } else {
            return b;
          }
        } else {
          return b;
        }
      });
      setScorePlayers(newTimesPlayers);
        

      if(data.data.round < 3){
        if(data.newQuestion){
          
          setRound(prev => prev+1);    
          console.log('nueva pregunta', data.newQuestion);
          setDataTrivia(data.newQuestion);
          setIsRunningTrivia(true);
        }
      } else if(newTimesPlayers.length == 6){
        setWinner(newTimesPlayers[0]);
        setOpenModal(true);
      }
    });

  },[socket]);


  useEffect(() => {

    if(round == 1){
      setDataTrivia(dataTrivia);
      setIsRunningTrivia(true);
    }

    console.warn('dcorrectAnswer-2', correctAnswer)
    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminT category={category} options={options} currentQuestion={currentQuestion}/>)
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

  }, [renderIn, category, options, currentQuestion, correctAnswer, scorePlayers, round]);

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
      {scorePlayers.length > 0 && 
      <div>
        {scorePlayers.map((player, index) => {
          return <p key={index}>{index+1} - {player.player.teamName} - {player.round} - {player.timeResponse} - {player.rightAnswers}</p>
        })}
      </div>}
      <div className='w-full my-5'>
          <div className=''>
            {render}
          </div>
      </div>
      {(renderIn == RENDER_CHALLENGE.admin
        || renderIn == RENDER_CHALLENGE.player
      ) &&      
      <Modal open={openModal} onClose={setOpenModal}>
          <div>
            <p className='text-center'>{descriptionModal}</p>
            {!passChallenge && <p>La respuesta correcta era: {correctAnswer}</p>}
            {renderIn == RENDER_CHALLENGE.player && 
            <button onClick={sendResult} className='btn'>{buttonModal}</button>
            }
          </div>
      </Modal>}   
    </div>
  );
};

export default Trivia_VS;
