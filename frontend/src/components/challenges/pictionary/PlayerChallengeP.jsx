import React, {useEffect, useState, useRef} from 'react';
import socket from '../../../config/socket';
import HideWord from '../common/HideWord'
import ChallengeNotPassed from '../common/ChallengeNotPassed';

const PlayerChallengeP = ({word, memberTeam}) => {

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('red');
    const [dibujando, setDibujando] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);

    useEffect(() => {
        if(word != ''){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            setContext(ctx);
        }
    }, []);
    
    const empezarDibujo = (event) => {
        const { offsetX, offsetY } = obtenerCoordenadas(event);
        context.beginPath();
        context.moveTo(offsetX, offsetY);

        socket.emit('pictionary', {function: 'startDraw', data: {offsetX, offsetY, socketId: socket.id}});

        setDibujando(true);
    };

    const dibujar = (event) => {
        if (!dibujando) return;
    
        const { offsetX, offsetY } = obtenerCoordenadas(event);
        context.lineTo(offsetX, offsetY);
        context.strokeStyle = color;
        context.stroke();
    
        socket.emit('pictionary', {function: 'draw', data: {offsetX, offsetY, color, socketId: socket.id}});    
    };

    const terminarDibujo = () => {
        context.closePath();

        socket.emit('pictionary', {function: 'stopDraw', data: {drawing: dibujando, socketId: socket.id}});
        setDibujando(false);
    };

    const cambiarColor = (nuevoColor) => {
        setColor(nuevoColor);   
    };

    const borrarTodo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        socket.emit('pictionary', {function: 'eraseEverything', data: {drawing: dibujando, socketId: socket.id}});
      };

    const obtenerCoordenadas = (event) => {
        const { clientX, clientY, target } = event.touches ? event.touches[0] : event;
        const { left, top } = target.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        return { offsetX, offsetY };
      };
    
    const finishChallenge = () => {
        setShowButton(false);
        socket.emit('stopChallenge', {socketId: socket.id});
    }

    return (
        <div>
            <div>
                { !gameFinished && word == '' 
                ? 
                <div>
                    <p>Esperando al oponente...</p>
                </div>
                : 
                <div>
                    <div>
                        <h1>{{memberTeam}} debe hacer el dibujo</h1>
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={300}
                            style={{ border: '1px solid #ccc' }}
                            onMouseDown={empezarDibujo}
                            onMouseMove={dibujar}
                            onMouseUp={terminarDibujo}
                            onMouseLeave={terminarDibujo}
                            onTouchStart={empezarDibujo}
                            onTouchMove={dibujar}
                            onTouchEnd={terminarDibujo}
                        />
                        <div>
                            <button onClick={() => cambiarColor('red')}>Rojo</button>
                            <button onClick={() => cambiarColor('green')}>Verde</button>
                            <button onClick={() => cambiarColor('blue')}>Azul</button>
                            <button onClick={() => cambiarColor('white')}>Borrar</button>
                            <button onClick={borrarTodo}>Borrar todo</button>
                        </div>
                    </div>
                    { showButton 
                        ?
                        <div><button onClick={finishChallenge}>Terminar</button></div>
                        :
                        <div>En proceso de revision...</div>
                    }  
                    <div>
                        <HideWord word={word}/>
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
