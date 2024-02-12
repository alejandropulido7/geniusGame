import React, { useRef, useEffect, useState } from 'react';

const Pictionary = ({setActiveChallenge}) => {
  const canvasRef = useRef(null);
  const canvasRefBoard = useRef(null);
  const [context, setContext] = useState(null);
  const [contextBoard, setContextBoard] = useState(null);
  const [color, setColor] = useState('red');
  const [dibujando, setDibujando] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasBoard = canvasRefBoard.current;
    const ctx = canvas.getContext('2d');
    const ctxBoard = canvasBoard.getContext('2d');
    setContext(ctx);
    setContextBoard(ctxBoard);
  }, []);

  const empezarDibujo = (event) => {
    const { offsetX, offsetY } = obtenerCoordenadas(event);
    context.beginPath();
    context.moveTo(offsetX, offsetY);

    contextBoard.beginPath();
    contextBoard.moveTo(offsetX, offsetY);

    setDibujando(true);
  };

  const dibujar = (event) => {
    if (!dibujando) return;

    const { offsetX, offsetY } = obtenerCoordenadas(event);
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = color;
    context.stroke();

    contextBoard.lineTo(offsetX, offsetY);
    contextBoard.strokeStyle = color;
    contextBoard.stroke();

  };

  const terminarDibujo = () => {
    context.closePath();
    contextBoard.closePath();
    setDibujando(false);
  };

  const cambiarColor = (nuevoColor) => {
    setColor(nuevoColor);
  };

  const borrarTodo = () => {
    const canvas = canvasRef.current;
    const canvasBoard = canvasRefBoard.current;
    const ctx = canvas.getContext('2d');
    const ctxBoard = canvasBoard.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxBoard.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
  };

  const obtenerCoordenadas = (event) => {
    const { clientX, clientY, target } = event.touches ? event.touches[0] : event;
    const { left, top } = target.getBoundingClientRect();
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    return { offsetX, offsetY };
  };

  return (
    <div>
        <div>
            <h1>Dibujar en Jugador</h1>
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
        <div>
            <h1>Board</h1>
            <canvas
                ref={canvasRefBoard}
                width={500}
                height={300}
                style={{ border: '1px solid #ccc' }}
            />
        </div>
        <button onClick={() => setActiveChallenge(false)}>Terminar</button>
    </div>
  );
};

export default Pictionary;
