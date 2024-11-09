import React, {useEffect, useState, useRef, useContext} from 'react';
import HideWord from '../common/HideWord'
import ChallengeNotPassed from '../common/ChallengeNotPassed';
import { SocketContext } from '../../../context/SocketProvider';
import { FaEraser } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import HideWordPlayer from '../common/HideWordPlayer';


const PlayerChallengeP = ({word, memberTeam}) => {

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('red');
    const [dibujando, setDibujando] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);
    const {socket} = useContext(SocketContext);
    const [dimensions, setDimensions] = useState({ 
        width: 1,
        height: 1, 
    });
    const [showFinishButton, setShowFinishButton] = useState(false);

    useEffect(() => {
        const handleTouchMove = (e) => {
          if (dibujando) {
            e.preventDefault(); // Prevent scrolling while drawing
          }
        };
    
        const canvas = canvasRef.current;
        canvas?.addEventListener('touchmove', handleTouchMove, { passive: false });
    
        return () => {
          canvas?.removeEventListener('touchmove', handleTouchMove);
        };
      }, [dibujando]);

    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        socket?.emit('pictionary', {function: 'resize', data: {
            width: window.innerWidth, 
            height: window.innerHeight, socketId: socket?.id}});
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const properties = JSON.parse(localStorage.getItem('pictionary-pl-GG'));
        if(properties != null){
            setContext(properties.context);
            setShowButton(properties.showButton);
            setGameFinished(properties.gameFinished);
            setShowFinishButton(properties.showFinishButton);
        }
    },[])
    
    useEffect(() => {
        localStorage.setItem('pictionary-pl-GG', JSON.stringify({showFinishButton, gameFinished, showButton}))
    },[showFinishButton, gameFinished, showButton]);

    useEffect(() => {
        handleResize();
        if(word != ''){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            setContext(ctx);
        }
    }, [word]);
    
    const empezarDibujo = (event) => {
        // event.preventDefault();
        setDibujando(true);
        const { offsetX, offsetY } = obtenerCoordenadas(event);
        context.beginPath();
        context.moveTo(offsetX, offsetY);

        socket?.emit('pictionary', {function: 'startDraw', data: {offsetX, offsetY, socketId: socket?.id}});

    };

    const dibujar = (event) => {
        // event.preventDefault();
        if (!dibujando) return;
    
        const { offsetX, offsetY } = obtenerCoordenadas(event);
        context.lineTo(offsetX, offsetY);
        context.strokeStyle = color;
        context.stroke();
    
        socket?.emit('pictionary', {function: 'draw', data: {offsetX, offsetY, color, socketId: socket?.id}});    
    };

    const terminarDibujo = () => {
        setDibujando(false);
        context.closePath();

        socket?.emit('pictionary', {function: 'stopDraw', data: {drawing: dibujando, socketId: socket?.id}});
    };

    const cambiarColor = (nuevoColor) => {
        setColor(nuevoColor);   
    };

    const borrarTodo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        socket?.emit('pictionary', {function: 'eraseEverything', data: {drawing: dibujando, socketId: socket?.id}});
      };

    const obtenerCoordenadas = (event) => {
        const { clientX, clientY, target } = event.touches ? event.touches[0] : event;
        const { left, top } = target.getBoundingClientRect();
        const offsetX = (clientX - left);
        const offsetY = (clientY - top);
        return { offsetX, offsetY };
      };
    
    const finishChallenge = () => {
        setShowButton(false);
        socket?.emit('stopChallenge', {socketId: socket?.id});
    }

    return (
        <div>
            <div>
                { !gameFinished && showButton 
                ?
                <div>
                    { word == '' 
                    ? 
                    <div>
                        <p>Esperando al oponente...</p>
                    </div>
                    : 
                    <div className='relative'>
                        <h1> <span className='uppercase underline text-red-500'>{memberTeam}</span> debe hacer el dibujo</h1>
                        <div>
                            <HideWordPlayer word={word} gameFinished={gameFinished} setShowFinishButton={setShowFinishButton}/>
                        </div>
                        <div className='mt-10 w-full'>
                            <canvas
                                ref={canvasRef}
                                width={dimensions.width > 500 ? dimensions.width * 0.8 : dimensions.width * 0.6}
                                height={dimensions.height * 0.4}
                                style={{ border: '1px solid #ccc', 
                                    touchAction: 'none'
                                }}
                                onMouseDown={empezarDibujo}
                                onMouseMove={dibujar}
                                onMouseUp={terminarDibujo}
                                onMouseLeave={terminarDibujo}
                                onTouchStart={empezarDibujo}
                                onTouchMove={dibujar}
                                onTouchEnd={terminarDibujo}
                            />
                            <div className='flex flex-row gap-2 justify-end my-4'>
                                <p>color: </p>
                                <button className='w-7 h-7 border-2 border-black rounded-full bg-red-500' onClick={() => cambiarColor('red')}></button>
                                <button className='w-7 h-7 border-2 border-black rounded-full bg-green-500' onClick={() => cambiarColor('green')}></button>
                                <button className='w-7 h-7 border-2 border-black rounded-full bg-blue-500' onClick={() => cambiarColor('blue')}></button>
                                <button className='w-7 h-7 border-2 border-black rounded-full flex justify-center items-center' onClick={() => cambiarColor('white')}><FaEraser className=''/></button>
                                <button className='w-7 h-7 border-2 border-black rounded-full flex justify-center items-center' onClick={borrarTodo}><MdCleaningServices /></button>
                            </div>
                            {(showButton && word != '' && !gameFinished && showFinishButton) && 
                                <div>
                                    <button className='btn mt-7 bg-red-700 text-white' onClick={finishChallenge}>Terminar</button>
                                </div>
                            }
                        </div>
                    </div>
                    }
                </div>
                :
                <div>
                    <div>                        
                        { !showButton && <div>En proceso de revision...</div> }                               
                    </div>
                </div>
                }  
                <div>
                    <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={true}/>
                </div>                    
            </div>
        </div>
    )
}

export default PlayerChallengeP
