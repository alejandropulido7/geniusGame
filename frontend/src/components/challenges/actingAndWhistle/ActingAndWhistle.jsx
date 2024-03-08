import React, { useEffect, useState } from 'react';
import socket from '../../../config/socket';
import {Outlet, useParams, useNavigate} from 'react-router-dom'
import {RENDER_CHALLENGE} from '../../../utils/constants'
import AdminAW from './AdminAW';
import PlayerChallengeAW from './PlayerChallengeAW';
import OpponentInteractiveAW from './OpponentInteractiveAW';


const ActingAndWhistle = ({renderIn, title, description}) => {

  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const manejarPresionado = () => {
    setMostrarPalabra(true);
  };

  const manejarSuelto = () => {
    setMostrarPalabra(false);
  };

  useEffect(() => {
  
    socket.on('actingAndWhistle', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady)
    });

    console.log('renderView');
    console.log(renderIn);
    switch (renderIn) {
      case RENDER_CHALLENGE.admin:
        setRender(<AdminAW mostrarPalabra={mostrarPalabra} word={word} wordReady={wordReady}/>)
      break;
      case RENDER_CHALLENGE.player:
        setRender(<PlayerChallengeAW/>)
      break;
      case RENDER_CHALLENGE.opponent:
        setRender(<OpponentInteractiveAW wordReady={wordReady}/>)
      break;
    }    

  },[word, wordReady, renderIn]);
  

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {renderIn != RENDER_CHALLENGE.admin && 
      <div>
        {wordReady && 
        <button
          onMouseDown={manejarPresionado}
          onMouseUp={manejarSuelto}
          onTouchStart={manejarPresionado}
          onTouchEnd={manejarSuelto}
        >
          Watch the word
        </button>}
        {mostrarPalabra && wordReady && <p>{word}</p>}
        {(!wordReady || word=='') && <p>Waiting for the word...</p>}
      </div>}

      {render}
    </div>
  );
};


export default ActingAndWhistle;