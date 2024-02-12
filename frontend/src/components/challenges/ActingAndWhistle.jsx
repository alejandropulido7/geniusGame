import React, { useState } from 'react';

const ActingAndWhistle = ({setActiveChallenge}) => {
  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [word, setWord] = useState('');
  const [wordReady, setWordReady] = useState(false);
  const [hideOpponentOptions, setHideOpponentOptions] = useState(false);

  const manejarPresionado = () => {
    setMostrarPalabra(true);
  };

  const manejarSuelto = () => {
    setMostrarPalabra(false);
  };

  const sendWordToOpponent = () => {
    setWordReady(true);    
    setHideOpponentOptions(true);
  }

  return (
    <div>
      <button
        onMouseDown={manejarPresionado}
        onMouseUp={manejarSuelto}
        onTouchStart={manejarPresionado}
        onTouchEnd={manejarSuelto}
      >
        Presionar y Soltar
      </button>
      {
        !hideOpponentOptions && 
        <div>
          <input type="text" placeholder='Type a phrase or word to your opponent' onChange={(e) => setWord(e.target.value)}/>
          <button onClick={sendWordToOpponent}>Sent word</button>
        </div>
      }      
      {mostrarPalabra && wordReady && <p>{word}</p>}
      {(!wordReady || word=='') && <p>Waiting for the word...</p>}
      <button onClick={() => setActiveChallenge(false)}>Terminar</button>
    </div>
  );
};

export default ActingAndWhistle;