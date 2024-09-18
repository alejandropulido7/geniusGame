import React, {useState, useEffect, useContext} from 'react';
import {useParams, useResolvedPath} from 'react-router-dom';
// import socket from '../../config/socket';
import {GlobalContext} from '../../context/GlobalContext';
import { SocketContext } from '../../context/SocketProvider';
import AllowJoin from './AllowJoin';

const DataGame = () => {

    const {idRoom} = useParams();
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState('Conectado');
    const [players, setPlayers] = useState(null);
    const {session, activeChallenge} = useContext(GlobalContext);
    const [activeStartGame, setActiveStartGame] = useState(false);
    const {socket, token} = useContext(SocketContext);
    const [urlJoin, setUrlJoin] = useState('');

    useEffect(() => {
        if(socket){
            socket.on('winGame', (data) => {
                setWinner(data.teamName);
            });
    
            socket.on('status', (data) => {
                setStatus(data);
            });

            socket.on('playerJoinedRoom', (playersInSession) => {
                setPlayers(playersInSession);
                if(playersInSession.length > 1){
                    setActiveStartGame(true);
                }
            });
            return () => {
                socket.off('winGame');
            }
        }
        
    }, [socket, session, activeChallenge]);

    useEffect(() => {
        // const path_complete = window.location.href;
        let path = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
        path = `${path}/player/${token}`
        setUrlJoin(path);
    },[token]);

    const readyToPlay = () => {
        if(players.length > 1){
            setActiveStartGame(false);
            socket.emit('startGame', session.id);
        } else {
            setStatus('No hay suficientes equipos para jugar (min. 2)')
        }
      }

    return (
        <>            
            {!activeChallenge && 
            <div className='steps-center-container'
                style={{backgroundColor: '#FFCC00'}}>           
                {winner != '' && <div>El ganador es: {winner}</div>}
            {idRoom && 
            <div className='data-game-container '>
                <div className='data-game-title top w-full h-16'>
                    <h1 className=' text-3xl text-white p-2 font-bold'>Board braker</h1>
                </div>
                <div className='data-game-center flex gap-5 '>
                    {players && 
                    <div className='data-game-players w-50 p-4 shadow-md bg-yellow-300 shadow-yellow-800'>
                        <p>Equipos: </p>
                        {
                            players.map((player) => {
                                return (
                                    <div key={player.teamName}>
                                        <h3>{player.teamName} - {player.positionActive}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>}
                    {session && 
                    <div className='w-50 p-4 flex justify-between flex-col shadow-md shadow-yellow-800 border-0 bg-yellow-300 border-black'>
                        <h4>Sesion {session.id}</h4>
                        <p className='text-wrap'>{session.min_to_answer} minutos para responder retos</p>
                        <div>
                            <p>Estado: {status}</p>
                        </div>
                    </div>}                  
                </div>
                {session &&
                <div className='data-game-bottom m-auto '>
                    { !session.gameStarted && activeStartGame && <button className='btn btn-wood text-white' onClick={readyToPlay}>Listo para jugar</button>}
                    { !activeStartGame && <AllowJoin textToCopy={urlJoin}/> }
                </div>}                
            </div>}
            </div>}
        </>
    )
}

export default DataGame
