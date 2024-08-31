import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Trivia = ({setActiveChallenge}) => {
  const [preguntaActual, setPreguntaActual] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [puntaje, setPuntaje] = useState(0);

  const obtenerPregunta = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = response.data.results[0];
      setPreguntaActual(data.question);
      setOpciones([...data.incorrect_answers, data.correct_answer].sort(() => Math.random() - 0.5));
      setRespuestaCorrecta(data.correct_answer);
    } catch (error) {
      console.error('Error al obtener pregunta:', error.message);
    }
  };

  const manejarRespuesta = (respuesta) => {
    if (respuesta === respuestaCorrecta) {
      alert('¡Respuesta correcta!');
      setPuntaje((prevPuntaje) => prevPuntaje + 1);
    } else {
      alert('Respuesta incorrecta. El juego ha terminado.');
      reiniciarJuego();
    }
  };

  const reiniciarJuego = () => {
    setPuntaje(0);
    obtenerPregunta();
  };

  useEffect(() => {
    obtenerPregunta();
  }, []); // Se ejecuta solo al montar el componente

  return (
    <div>
      <h1>Trivia Game</h1>
      <p>Pregunta: {preguntaActual}</p>
      <ul>
        {opciones.map((opcion, index) => (
          <li key={index} onClick={() => manejarRespuesta(opcion)}>
            {opcion}
          </li>
        ))}
      </ul>
      <p>Puntaje: {puntaje}</p>
      <button className='btn' onClick={reiniciarJuego}>Reiniciar Juego</button>
      <button className='btn' onClick={() => setActiveChallenge(false)}>Terminar</button>
    </div>
  );
};

export default Trivia;
