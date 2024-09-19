import React, { useEffect, useRef, useState, useContext } from 'react';
import ChallengeNotPassed from '../common/ChallengeNotPassed';
import { SocketContext } from '../../../context/SocketProvider';

const AdminP = ({word}) => {
    const canvasRefBoard = useRef();
    const [contextBoard, setContextBoard] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const {socket} = useContext(SocketContext);

    const hideWord = ' _ '.repeat(word?.length);

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
                 <p>Waiting for the word...</p>
            </div>
            :
            <div>
                
                <h1>Board</h1>
                <canvas
                    ref={canvasRefBoard}
                    width={500}
                    height={300}
                    style={{ border: '1px solid #ccc' }}
                /> 
            </div>
            }            
        </div>
    )
}

export default AdminP
