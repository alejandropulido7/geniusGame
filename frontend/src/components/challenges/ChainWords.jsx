import React, { useState } from 'react';

const ChainWord = () => {
  const [ultimaPalabra, setUltimaPalabra] = useState('');
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [historialPalabras, setHistorialPalabras] = useState([]);

  const manejarNuevaPalabra = ({setActiveChallenge}) => {
    if (nuevaPalabra && (!ultimaPalabra || nuevaPalabra.charAt(0).toLowerCase() === ultimaPalabra.slice(-1).toLowerCase())) {
      setHistorialPalabras([...historialPalabras, nuevaPalabra]);
      setUltimaPalabra(nuevaPalabra);
      setNuevaPalabra('');
    } else {
      alert('La palabra no cumple con las reglas del juego.');
    }
  };

  return (
    <div>
      <h1>Palabras Encadenadas</h1>
      <p>Última Palabra: {ultimaPalabra || 'Ninguna'}</p>
      <ul>
        {historialPalabras.map((palabra, index) => (
          <li key={index}>{palabra}</li>
        ))}
      </ul>
      <label>
        Nueva Palabra:
        <input type="text" value={nuevaPalabra} onChange={(e) => setNuevaPalabra(e.target.value)} />
      </label>
      <button onClick={manejarNuevaPalabra}>Agregar Palabra</button>
      <button onClick={() => setActiveChallenge(false)}>Terminar</button>
    </div>
  );
};

export default ChainWord;