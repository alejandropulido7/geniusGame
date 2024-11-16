import React, { useContext, useEffect, useState } from 'react'
import './VideoGainFlags.css';
import { findFlagProperties } from '../../../utils/constants';
import { AudioContext } from '../../../context/AudioProvider';
import Confetti from 'react-confetti'

export const VideoGainFlags = ({infoPlayer, flagGained, audio, waitForOpponent=false}) => {

    const {playSound} = useContext(AudioContext);

    useEffect(() => {
      console.log(flagGained);
    }, [infoPlayer, flagGained, audio, waitForOpponent])

    return (
      <div className='flex justify-center items-center self-center text-white background-gain-flag'>
        {playSound(audio, 0.5)}
        <Confetti/>
        <video autoPlay muted className="background-video">
          <source src={findFlagProperties(flagGained)?.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className='flex flex-col gap-6 p-6'>
          <h3>Wow! el equipo <span className='uppercase underline text-black'>{infoPlayer.teamName}</span> ha ganado la bandera {findFlagProperties(flagGained)?.name}</h3>
          {waitForOpponent && <p>Esperando a que elija su proxima bandera...</p>}
        </div>
      </div>
    );
}
