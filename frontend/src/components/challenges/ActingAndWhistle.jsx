import React, { useEffect, useState } from 'react';
import socket from '../../config/socket';

const ActingAndWhistle = ({renderIn}) => {

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

    switch (renderIn) {
      case 'ADMIN':
        setRender(<Admin mostrarPalabra={mostrarPalabra} word={word} wordReady={wordReady}/>)
      break;
      case 'PLAYER':
        setRender(<PlayerChallenge setMostrarPalabra={mostrarPalabra}/>)
      break;
      case 'OPPONENT_INTERACTIVE':
        setRender(<OpponentInteractive setWord={setWord} setWordReady={setWordReady}/>)
      break;
    }

  },[]);
  

  return (
    <div>
      {renderIn != 'ADMIN' && 
      <div>
        {wordReady && 
        <button
          onMouseDown={manejarPresionado}
          onMouseUp={manejarSuelto}
          onTouchStart={manejarPresionado}
          onTouchEnd={manejarSuelto}
        >
          Presionar y Soltar
        </button>}
        {mostrarPalabra && wordReady && <p>{word}</p>}
        {(!wordReady || word=='') && <p>Waiting for the word...</p>}
      </div>}

      {render}
    </div>
  );
};

const PlayerChallenge = ({setMostrarPalabra}) => {

  const emitResult = () => {
    socket.emit('resultChallenge', {playerId: socket.id, challengePassed: true});
  }

  return (
    <div>
      <button onClick={() => setMostrarPalabra(true)}>Challenge done!</button>
      <button onClick={emitResult}>Terminar</button>
    </div>
  )
}


const OpponentInteractive = ({setWordReady, setWord}) => {

  return (
    <>
      {
        !hideOpponentOptions && 
        <div>
          <input type="text" placeholder='Type a phrase or word to your opponent' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={() => setWordReady(true)}>Sent word</button>
        </div>
      }
      <Common/>
    </>
  )
}

const Admin = ({mostrarPalabra, wordReady, word}) => {

  const hideWord = '_'.repeat(word.length);

  return (
    <div>
      <p>{hideWord}</p>
      {mostrarPalabra && wordReady && <p>{word}</p>}
      {(!wordReady || word=='') && <p>Waiting for the word...</p>}
    </div>
  )
}


export default ActingAndWhistle;