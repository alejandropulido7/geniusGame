import React, { useEffect, useState } from 'react';
import socket from '../../config/socket';
import {Outlet, useParams, useNavigate} from 'react-router-dom'

const ActingAndWhistle = ({renderIn}) => {

  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [render, setRender] = useState(null);
  const {renderInScreen} = useParams();

  const manejarPresionado = () => {
    setMostrarPalabra(true);
  };

  const manejarSuelto = () => {
    setMostrarPalabra(false);
  };

  useEffect(() => {

    console.log(renderInScreen);
  
    socket.on('actingAndWhistle', (data) => {
      setWord(data.word);
      setWordReady(data.wordReady)
    });

    console.log('renderView');
    console.log(renderIn);
    switch (renderIn) {
      case 'ADMIN':
        setRender(<Admin mostrarPalabra={mostrarPalabra} word={word} wordReady={wordReady}/>)
      break;
      case 'PLAYER':
        setRender(<PlayerChallenge/>)
      break;
      case 'OPPONENT_INTERACTIVE':
        setRender(<OpponentInteractive wordReady={wordReady}/>)
      break;
    }    

  },[word, wordReady, renderIn]);
  

  return (
    <div>
      <h1>Acting</h1>
      {renderIn != 'ADMIN' && 
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

const PlayerChallenge = () => {

  const emitResult = () => {
    socket.emit('resultChallenge', {playerId: socket.id, challengePassed: true});
  }

  return (
    <div>
      <button onClick={emitResult}>Terminar</button>
    </div>
  )
}


const OpponentInteractive = ({wordReady}) => {

  const [word, setWord] = useState('');

  const emitWordChallenge = () => {
    socket.emit('actingAndWhistle', {word, wordReady: true, socketId: socket.id});
    socket.emit('startChallenge', {socketId: socket.id});
  }

  return (
    <>
      { !wordReady && <div>
        <input type="text" placeholder='Type a phrase or word to your opponent' onChange={(e) => setWord(e.target.value)}/>
        <button onClick={emitWordChallenge}>Sent word</button>
      </div>}
    </>
  )
}

const Admin = ({mostrarPalabra, wordReady, word}) => {

  const hideWord = ' _ '.repeat(word.length);

  return (
    <div>
      <p>{hideWord}</p>
      {mostrarPalabra && wordReady && <p>{word}</p>}
      {!wordReady && <p>Waiting for the word...</p>}
    </div>
  )
}


export default ActingAndWhistle;