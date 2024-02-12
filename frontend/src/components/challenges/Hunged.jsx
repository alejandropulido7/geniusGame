import React, { useState, useEffect } from 'react';

const Hunged = ({setActiveChallenge}) => {
  const palabras = ['react', 'javascript', 'componente', 'desarrollo', 'ahorcado'];
//   const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    const palabraSecreta = 'javascript';

    const palabraSecretaEnGuiones = '_'.repeat(palabraSecreta.length);

  const [palabraMostrada, setPalabraMostrada] = useState(palabraSecretaEnGuiones);
  const [intentosRestantes, setIntentosRestantes] = useState(6);
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  useEffect(() => {
    const palabraCompleta = palabraSecretaEnGuiones.split('').join(' ');
    setPalabraMostrada(palabraCompleta);
  }, []);

  const manejarIntento = (letra) => {
    if (!juegoTerminado && !letrasAdivinadas.includes(letra)) {
        
        if (!palabraSecreta.includes(letra)) {
            setIntentosRestantes((prevIntentos) => prevIntentos - 1);
        }
        const letrasAdivinadasCopy = [...letrasAdivinadas];
        letrasAdivinadasCopy.push(letra);
        setLetrasAdivinadas(letrasAdivinadasCopy);

        const nuevaPalabraMostrada = palabraSecreta
            .split('')
            .map((char) => (letrasAdivinadasCopy.includes(char) ? char : '_'))
            .join(' ');

        setPalabraMostrada(nuevaPalabraMostrada);

        if (!nuevaPalabraMostrada.includes('_')) {
            setJuegoTerminado(true);
        }

        if (intentosRestantes === 0) {
            setJuegoTerminado(true);
        }
    }
  };

  const reiniciarJuego = () => {
    setPalabraMostrada(() => '_'.repeat(palabraSecreta.length));
    setIntentosRestantes(6);
    setLetrasAdivinadas([]);
    setJuegoTerminado(false);
  };

  return (
    <div>
      <h1>Juego del Ahorcado</h1>
      <p>Palabra: {palabraMostrada}</p>
      <p>Intentos Restantes: {intentosRestantes}</p>
      <div>
        {!juegoTerminado &&
          'abcdefghijklmnopqrstuvwxyz'.split('').map((letra) => (
            <button key={letra} onClick={() => manejarIntento(letra)} disabled={letrasAdivinadas.includes(letra)}>
              {letra}
            </button>
          ))}
      </div>
      {juegoTerminado && (
        <div>
          <p>{intentosRestantes === 0 && palabraMostrada.includes('_') ? 'Perdiste. La palabra era:' : '¡Felicidades! Has ganado. La palabra era:'}</p>
          <p>{palabraSecreta}</p>
          <button onClick={reiniciarJuego}>Reiniciar Juego</button>
        </div>
      )}
      <button onClick={() => setActiveChallenge(false)}>Terminar</button>
    </div>
  );
};

export default Hunged;