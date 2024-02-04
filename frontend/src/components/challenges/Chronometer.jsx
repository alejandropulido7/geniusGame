import React, { useState, useEffect } from 'react';

const Chronometer = ({setChallengeFinished}) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(interval);
        // Cuando el contador llega a cero, mostrar mensaje de juego perdido
        alert('¡Perdiste el juego!');
      }
    }, 1000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div>
      <h1>Contador de Juego</h1>
      <p>Tiempo restante: {seconds} segundos</p>
    </div>
  );
};

export default Chronometer;