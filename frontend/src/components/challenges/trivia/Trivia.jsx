import React, { useState, useEffect, useContext } from 'react';
import Modal from '../../common/modal/Modal';
import AdminT from './AdminT';
import PlayerChallengeT from './PlayerChallengeT';
import OpponentInteractiveT from './OpponentInteractiveT';
import OthersPlayersT from './OthersPlayersT';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import { SocketContext } from '../../../context/SocketProvider';

const Trivia = ({renderIn, dataTrivia}) => {
  const [render, setRender] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState('');
  const [buttonModal, setButtonModal] = useState('');
  const [passChallenge, setPassChallenge] = useState(false);
  const [player, setPlayer] = useState({});
  const {socket} = useContext(SocketContext);

  useEffect(() => {
    console.log(dataTrivia)
    if(dataTrivia){
      setCategory(dataTrivia.category);
      setCurrentQuestion(dataTrivia.question);
      setOptions(dataTrivia.options);
      setCorrectAnswer(dataTrivia.correctAnswer);
    }
  },[dataTrivia]);

  useEffect(() => {
    socket?.on('trivia-regular', (data) => {
      setPlayer(data.player);
      if (data.response === correctAnswer) {
        setDescriptionModal('¡Respuesta correcta!');
        setButtonModal('Avanzar');
        setPassChallenge(true);
      } else {
        setDescriptionModal('Respuesta incorrecta. Retrocedes a la casilla anterior');
        setButtonModal('Ok 😪');
        setPassChallenge(false);
      }
      setOpenModal(true);
    });

  },[socket, correctAnswer]);

  useEffect(() => { 

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminT category={category} options={options} currentQuestion={currentQuestion}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeT options={options} correctAnswer={correctAnswer}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveT correctAnswer={correctAnswer}/>);
      break;
      default:
        setRender(<OthersPlayersT correctAnswer={correctAnswer}/>);
      break;
    } 

  }, [renderIn, category, options, currentQuestion, correctAnswer]);
  
  const sendResult = () => {
    socket?.emit('resultChallenge', {player, challengePassed: passChallenge});
  }

  return (
    <div className='m-auto'>
      <div className='w-full my-5'>
          <div className=''>
            {render}
          </div>
      </div>
      {(renderIn == RENDER_CHALLENGE.admin
        || renderIn == RENDER_CHALLENGE.player
      ) &&      
      <Modal open={openModal} onClose={setOpenModal}>
          <div className='flex flex-col gap-5'>
            <p className='text-center'>{descriptionModal}</p>
            {!passChallenge && <p>La respuesta correcta era: {correctAnswer}</p>}
            {renderIn == RENDER_CHALLENGE.player && 
            <button onClick={sendResult} className='btn bg-red-600 text-white'>{buttonModal}</button>
            }
          </div>
      </Modal>}   
    </div>
  );
};

export default Trivia;
