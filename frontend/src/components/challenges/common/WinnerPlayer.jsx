import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Confetti from 'react-confetti'
import winner_video_turn from '../../../assets/videos/win-game-turn.mp4';
import { Fireworks } from 'fireworks-js'
import { getCookie } from '../../../utils/cookies';
// import './Winner.css';


const WinnerPlayer = ({winner}) => {
    const navigate = useNavigate();
    const [isWinner, setisWinner] = useState(false);

    const finishGame = () => {
        navigate('../room');
    }

    useEffect(() => {
      if(winner.idTeam == getCookie('idDevice-GG')){
        setisWinner(true)
        const container = document.querySelector('#fireworks');
        const fireworks = new Fireworks(container, {
          autoresize: true,
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,
          particles: 50,
        });
  
        fireworks.start();
      }

      return () => {
        // fireworks.stop();
      };
    }, [])

  return (
    <div className='winner-container flex justify-center items-center flex-col' style={{background: !isWinner ? '#D4B2CD' : 'transparent'}}>
        { isWinner
        ?
        <div>        
          <video autoPlay muted loop className="winner-video" width={500}>
            <source src={winner_video_turn} type="video/mp4" />
            Your browser does not support the video tag.
          </video> 
          <div className='relative flex flex-col gap-10 z-10'>
            <h1 className='uppercase text-9xl'>{winner.teamName}</h1>
            <h1 className='uppercase text-7xl'>Ganador</h1>
            <button onClick={finishGame} className='btn my-5 text-white bg-black shadow-sm shadow-white'>Ir al inicio</button>
          </div>
        </div>
        :
          <div>
            <div>
              <h1 className='uppercase text-7xl my-5'>Perdiste</h1>
              <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDlhZDdkamFhcmE0MDI0aHN3ZnE3aDNwYTgwMGhuZmRibmVnc3VkciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6wrvdHFbwBrUFenu/giphy.webp" width="480" height="271"/>
            </div>
            <div>
              <button onClick={finishGame} className='btn my-5 text-white bg-black shadow-sm shadow-white'>Ir al inicio</button>
            </div>
          </div>
        }
        
        {winner.idTeam == getCookie('idDevice-GG') && <div id="fireworks" className='w-full absolute' style={{height: '100vh'}}></div> }
         
    </div>
  )
}

export default WinnerPlayer
