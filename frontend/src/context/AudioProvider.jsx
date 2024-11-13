import React, { createContext, useRef } from 'react';
import background_game from '../assets/audio/background_game-3.mp3';
import move_piece from '../assets/audio/move-piece-1.mp3';
import steal_flag from '../assets/audio/gain-flag.mp3';
import trivia_vs_audio from '../assets/audio/trivia-vs.mp3';
import gain_flag from '../assets/audio/steal-flag.mp3';
import winner_game from '../assets/audio/winner-game.mp3';

import lose_challenge from '../assets/audio/lose-challenge.mp3';
import time from '../assets/audio/time.mp3';


export const AudioContext = createContext({
    audioRefBackground: null,
    audioRefPieceMove: null,
    audioRefGainFlag: null,
    audioRefTriviaVersus: null,
    audioRefStealFlag: null,
    audioRefLoseChallenge: null,
    audioRefTime: null,
    audioRefWinnerGame: null,
    playSound: (audioRef, volume, loop, playBackRate) => {},
    stopSound: (audioRef) => {},
});

export const AudioProvider = ({ children }) => {

    const initialState = {
        audioRefBackground: useRef(new Audio(background_game)),
        audioRefPieceMove: useRef(new Audio(move_piece)),
        audioRefGainFlag: useRef(new Audio(gain_flag)),
        audioRefTriviaVersus: useRef(new Audio(trivia_vs_audio)),
        audioRefStealFlag: useRef(new Audio(steal_flag)),
        audioRefLoseChallenge: useRef(new Audio(lose_challenge)),
        audioRefTime: useRef(new Audio(time)),
        audioRefWinnerGame: useRef(new Audio(winner_game))
    }
        

    const playSound = (audioRef, volume=0.5, loop=false, playBackRate=1) => {
        const audio = audioRef.current;
        audio.loop = loop;
        audio.volume = volume;
        audio.playbackRate = playBackRate;
        audio.play()
          .catch((error) => {
            console.error('Audio play failed:', error);
          });
    };

    const stopSound = (audioRef) => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0; // Reset to the beginning
      };


  return (
    <AudioContext.Provider value={{
        audioRefBackground: initialState.audioRefBackground,
        audioRefPieceMove: initialState.audioRefPieceMove,
        audioRefGainFlag: initialState.audioRefGainFlag,
        audioRefTriviaVersus: initialState.audioRefTriviaVersus,
        audioRefStealFlag: initialState.audioRefStealFlag,
        audioRefLoseChallenge: initialState.audioRefLoseChallenge,
        audioRefTime: initialState.audioRefTime,
        audioRefWinnerGame: initialState.audioRefWinnerGame,
        playSound,
        stopSound
    }}>
      {children}
    </AudioContext.Provider>
  );
};
