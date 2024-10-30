import React, {useEffect, useState, useContext} from 'react'
import {CHALLENGES_IN_BOARD} from '../../../utils/constants';
import { SocketContext } from '../../../context/SocketProvider';

const Roulette = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [stopRotation, setStopRotation] = useState(false);
    const [result, setResult] = useState(null);
    const [dataRenderChallenge, setDataRenderChallenge] = useState({});
    const {socket} = useContext(SocketContext);

    const options = CHALLENGES_IN_BOARD;

    useEffect(() => {

        if(socket){
            socket.on('openModalRoulette-startRoulette', (data) => {  
                setIsSpinning(true);
                setResult(null);
                setDataRenderChallenge(data);    
            });

            socket.on('openModalRoulette-stopRoulette', (data) => {  
                setIsSpinning(false);
                setStopRotation(true);
                setDataRenderChallenge(data);
            });
        }

    }, [socket]);

    useEffect(() => {
        let interval;
        if (isSpinning) {
            interval = setInterval(() => {
                setRotation(prevRotation => prevRotation + 10);
            }, 10);
        } else if (stopRotation) {
            clearInterval(interval);
            const finalRotation = rotation % 360;
            const segmentAngle = 360 / options.length;
            const winningIndex = Math.floor((360 - finalRotation + segmentAngle / 2) % 360 / segmentAngle);
            setResult(options[winningIndex].name);
            const dataResult = {...dataRenderChallenge};
            dataResult.challenge = options[winningIndex].id;
            // dataResult.challenge = 'acting';
            dataResult.isLastStep = true;
            socket?.emit('openModalConfirmation', dataResult);
            setStopRotation(false);
        }

        return () => {
            clearInterval(interval);
        }
    }, [isSpinning, stopRotation, rotation, options]);

    return (
        <div className="flex flex-col items-center justify-center h-auto">
            <div className="relative rounded-full overflow-hidden">
                <div
                    className={`relative rounded-full border-4 border-gray-300 flex items-center justify-center transition-transform ease-linear z-10 `}
                    style={{ transform: `rotate(${rotation}deg)`, 
                        width: '50vh', 
                        height: '50vh' 
                    }}>
                
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="absolute text-3xl"
                            style={{
                                transform: `rotate(${index * (360 / options.length)}deg) translate(19vh) rotate(-${index * (360 / options.length)}deg)`
                            }}>
                            <img width='40x' height='40px' src={option.icon}></img> 
                        </div>
                    ))}                   
                
                </div>
                <div className='absolute'>
                    <div className='absolute bg-gray-300'
                        style={{clipPath: 'polygon(100% 0, 30% 50%, 100% 100%)', 
                            transform: 'rotate(0deg)', 
                            left: '16vh', 
                            top: '-40vh',
                            width: '34vh', 
                            height: '30vh'
                        }}
                        >
                    </div>
                </div>
            </div>
            {result && (
                <div className="mt-4 text-2xl">
                    Result: <span>{result}</span>
                </div>
            )}
        </div>
    )
}

export default Roulette
