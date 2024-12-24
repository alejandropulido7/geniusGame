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
    playSound: (audioRef, volume, loop, playBackRate) => {},
    stopSound: (audioRef) => {},
});

export const AudioProvider = ({ children }) => {        

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
        playSound,
        stopSound
    }}>
      {children}
    </AudioContext.Provider>
  );
};
