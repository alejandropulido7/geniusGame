import React, { useState, useEffect } from 'react';
import {colorsApp} from '../../../utils/constants';
import {getQuestionTrivia} from '../../../services/gameServices';
import Modal from '../../common/modal/Modal';
import AdminT from './AdminT';
import PlayerChallengeT from './PlayerChallengeT';
import OpponentInteractiveT from './OpponentInteractiveT';
import OthersPlayersT from './OthersPlayersT';
import {RENDER_CHALLENGE} from '../../../utils/constants'
import socket from '../../../config/socket';

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

  useEffect(() => {
    if(dataTrivia){
      setCategory(dataTrivia.category);
      setCurrentQuestion(dataTrivia.question);
      setOptions(dataTrivia.options);
      setCorrectAnswer(dataTrivia.correctAnswer);
    }
  },[dataTrivia]);

  useEffect(() => {
    
    socket.on('trivia-regular', (data) => {
      setPlayer(data.player);
      if (data.response === dataTrivia.correctAnswer) {
        setDescriptionModal('¡Respuesta correcta!');
        setButtonModal('Avanzar');
        setPassChallenge(true);
      } else {
        setDescriptionModal('Respuesta incorrecta. Retrocedes a la casilla anterior');
        setButtonModal('Ok 😪');
        setPassChallenge(false);
      }
      setOpenModal(true);
    })

    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminT category={dataTrivia.category} options={dataTrivia.options} currentQuestion={dataTrivia.question}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeT options={dataTrivia.options} correctAnswer={dataTrivia.correctAnswer}/>);
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveT correctAnswer={dataTrivia.correctAnswer}/>);
      break;
      default:
        setRender(<OthersPlayersT correctAnswer={dataTrivia.correctAnswer}/>);
      break;
    } 

    return () => {
      setCategory('');
      setCurrentQuestion('');
      setOptions('');
      setCorrectAnswer('');
    }
  }, [renderIn, dataTrivia]);
  
  const sendResult = () => {
    socket.emit('resultChallenge', {player, challengePassed: passChallenge});
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

export default Trivia;
