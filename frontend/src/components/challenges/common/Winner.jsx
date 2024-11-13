import React, {useContext, useEffect, useRef, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { Fireworks } from 'fireworks-js'
import winner_video from '../../../assets/videos/win-game.mp4';
import winner_video_turn from '../../../assets/videos/win-game-turn.mp4';
import './Winner.css';
import { AudioContext } from '../../../context/AudioProvider';



const Winner = ({winner}) => {

    const navigate = useNavigate();
    const {audioRefWinnerGame, playSound, stopSound} = useContext(AudioContext);
    const [secondVideo, setSecondVideo] = useState(false);

    useEffect(() => {
      playSound(audioRefWinnerGame, 1, false);
      const container = document.querySelector('#fireworks');
      const fireworks = new Fireworks(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        // sound: {
        //   enabled: true,
        //   volume: 1
        // }
      });

      let timer = setTimeout(() => {
        fireworks.start();
      }, 5000);

      return () => {
        fireworks.stop();
        clearTimeout(timer);
      };

    }, []);

    useEffect(() => {
      let secondVideo = setTimeout(() => {
        setSecondVideo(true);
      }, 7000);

      return () => {
        clearTimeout(secondVideo);
      };

    }, [secondVideo])

    const finishGame = () => {
      playSound(audioRefWinnerGame, 0.2, false);
        navigate('./');
    };

  return (
    <div className='winner-container flex justify-center items-center'>
        {secondVideo && <video autoPlay muted loop className="winner-video">
          <source src={winner_video_turn} type="video/mp4" />
          Your browser does not support the video tag.
        </video>}
        {!secondVideo &&
         <video autoPlay muted className="winner-video">
          <source src={winner_video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>}
        <div className='relative flex flex-col gap-10 z-10'>
          <h1 className='uppercase text-9xl'>{winner.teamName} </h1>
          <h1 className='uppercase text-7xl'>es el ganador</h1>
          <button onClick={finishGame} className='btn my-5 text-white bg-black shadow-sm shadow-white'>Ir al inicio</button>
        </div>
        <div id="fireworks" className='w-full absolute' style={{height: '100vh'}}>

        </div>
    </div>
  )
}

export default Winner
