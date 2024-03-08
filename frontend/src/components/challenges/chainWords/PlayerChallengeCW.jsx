import React, { useContext, useState } from 'react';
import socket from '../../../config/socket';
import { ChainWordsContext } from '../../../context/challenges/ChallengeContext';
import KeyboardCW from './KeyboardCW'

const PlayerChallengeCW = () => {

    const {newWord, lastWord, arrayWords, setArrayWords, setLastWord, setNewWord} = useContext(ChainWordsContext);
    const [newWordKeyboard, setNewWordKeyboard] = useState('');


    const [ultimaPalabra, setUltimaPalabra] = useState('');
    const [nuevaPalabra, setNuevaPalabra] = useState('');
    const [historialPalabras, setHistorialPalabras] = useState([]);

    const manageNewWord = () => {
      if (newWord && (!lastWord || newWord.charAt(0).toLowerCase() === lastWord.slice(-1).toLowerCase())) {
        setArrayWords([...arrayWords, newWord]);
        setLastWord(newWord);
        setNewWord('');
        // setHistorialPalabras([...historialPalabras, nuevaPalabra]);
        // setUltimaPalabra(nuevaPalabra);
        // setNuevaPalabra('');
      } else {
        alert('La palabra no cumple con las reglas del juego.');
      }
    };

    const emitResult = () => {
      socket.emit('resultChallenge', {playerId: socket.id, challengePassed: true});
    }
  
    return (
      <div>
        <KeyboardCW texto={newWord} setTexto={setNewWord}/>
        <button onClick={manageNewWord}>Agregar Palabra</button>
        <button onClick={emitResult}>Terminar</button>
      </div>
    )
  }

export default PlayerChallengeCW
