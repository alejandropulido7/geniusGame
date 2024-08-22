import React, { useEffect, useRef, useState } from 'react';
import socket from '../../../config/socket';
import ChallengeNotPassed from '../common/ChallengeNotPassed';

const AdminP = ({wordReady, word}) => {
    const canvasRefBoard = useRef(null);
    const [contextBoard, setContextBoard] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);

    const hideWord = ' _ '.repeat(word?.length);

    useEffect(() => {
        setCanvasBoard();
    }, []);

    const setCanvasBoard = () => {
        if(wordReady){
            const canvasBoard = canvasRefBoard.current;
            const ctxBoard = canvasBoard.getContext('2d');
            setContextBoard(ctxBoard);
        }
    }

    useEffect(() => {
        socket.on('pictionary-startDraw', (data) => {
            const canvasBoard = canvasRefBoard.current;
            const ctxBoard = canvasBoard.getContext('2d');

            ctxBoard.beginPath();
            ctxBoard.moveTo(data.offsetX, data.offsetY);
        });
        
        socket.on('pictionary-draw', (data) => {
            const canvasBoard = canvasRefBoard.current;
            const ctxBoard = canvasBoard.getContext('2d');

            ctxBoard.lineTo(data.offsetX, data.offsetY);
            ctxBoard.strokeStyle = data.color;
            ctxBoard.stroke();
        });

        socket.on('pictionary-stopDraw', (data) => {
            const canvasBoard = canvasRefBoard.current;
            const ctxBoard = canvasBoard.getContext('2d');

            ctxBoard.closePath();
        });

        socket.on('pictionary-eraseEverything', (data) => {
            const canvasBoard = canvasRefBoard.current;
            const ctxBoard = canvasBoard.getContext('2d');

            ctxBoard.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
        });

    },[])


    return (
        <div>
            {!wordReady 
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
            <div>
                <ChallengeNotPassed gameFinished={gameFinished} setGameFinished={setGameFinished} showButton={false}/>
            </div>
        </div>
    )
}

export default AdminP
