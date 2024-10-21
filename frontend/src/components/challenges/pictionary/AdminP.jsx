import React, { useEffect, useRef, useState, useContext } from 'react';
import ChallengeNotPassed from '../common/ChallengeNotPassed';
import { SocketContext } from '../../../context/SocketProvider';

const AdminP = ({word}) => {
    const canvasRefBoard = useRef();
    const [contextBoard, setContextBoard] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const {socket} = useContext(SocketContext);
    const hideWord = ' _ '.repeat(word?.length);
    const [dimensions, setDimensions] = useState({ 
        width: 500,
        height: 300, 
    });

    // const handleResize = () => {
    //     setDimensions({
    //         width: window.innerWidth,
    //         height: window.innerHeight,
    //     });
    // };

    // useEffect(() => {
    //     window.addEventListener('resize', handleResize);
    //     handleResize();
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    useEffect(() => {        
        if(word != ''){
            const canvasBoard = canvasRefBoard.current;
            if(canvasBoard){
                const ctxBoard = canvasBoard.getContext('2d');
                setContextBoard(ctxBoard);
            }
        }
    }, [word]);

    useEffect(() => {

        if(socket){
            socket.on('pictionary-resize', (data) => {
                const canvasBoard = canvasRefBoard.current;
                if (!canvasBoard) return;
                
                setDimensions({
                    width: data.width,
                    height: data.height,
                });
            });

            socket.on('pictionary-startDraw', (data) => {
                const canvasBoard = canvasRefBoard.current;
                if (!canvasBoard) return;
                const ctxBoard = canvasBoard.getContext('2d');
    
                ctxBoard.beginPath();
                ctxBoard.moveTo(data.offsetX, data.offsetY);
            });
            
            socket.on('pictionary-draw', (data) => {
                const canvasBoard = canvasRefBoard.current;
                if (!canvasBoard) return;
                const ctxBoard = canvasBoard.getContext('2d');
    
                ctxBoard.lineTo(data.offsetX, data.offsetY);
                ctxBoard.strokeStyle = data.color;
                ctxBoard.stroke();
            });
    
            socket.on('pictionary-stopDraw', (data) => {
                const canvasBoard = canvasRefBoard.current;
                if (!canvasBoard) return;
                const ctxBoard = canvasBoard.getContext('2d');
    
                ctxBoard.closePath();
            });
    
            socket.on('pictionary-eraseEverything', (data) => {
                const canvasBoard = canvasRefBoard.current;
                if (!canvasBoard) return;
                const ctxBoard = canvasBoard.getContext('2d');
    
                ctxBoard.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
            });
    
            return () => {
                socket.off('pictionary-startDraw');
                socket.off('pictionary-draw');
                socket.off('pictionary-stopDraw');
                socket.off('pictionary-eraseEverything');
            };
        }

    },[socket, word]);

    return (
        <div>
            <div>
                <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={false}/>
            </div>
            {word == '' 
            ?
            <div>
                <p>{hideWord}</p>
                 <p>Esperando la palabra para dibujar...</p>
            </div>
            :
            <div className='m-auto'>
                <canvas
                    ref={canvasRefBoard}
                    width={dimensions.width > 500 ? dimensions.width * 0.8 : dimensions.width * 0.6}
                    height={dimensions.height * 0.4}
                    style={{ border: '1px solid #ccc', margin: 'auto' }}
                /> 
            </div>
            }            
        </div>
    )
}

export default AdminP
