import React, { useState, useEffect } from 'react'
import socket from '../../config/socket';
import {useParams, useNavigate} from 'react-router-dom';
import {getSession} from '../../services/sessionService'
import BoardGame from './BoardGame';

const TeamJoined = () => {

    const [codeSession, setCodeSession] = useState('');
    const [session, setSession] = useState({});
    const [players, setPlayers] = useState([]);    
    const {idRoom} = useParams();
    const navigate = useNavigate();
    
    const getSessionCreated = async (idRoom) => {
        
        const sessionCreated = await getSession(idRoom);
        if(sessionCreated){
            setSession(sessionCreated);
            socket.emit('createNewGame', sessionCreated.id);
        } else {
            navigate('../room');
        }
    }    

    useEffect(() => {        
        setCodeSession(idRoom);
        getSessionCreated(idRoom);
    },[]);

    socket.on('status', (msg) => {
        console.log(msg)
    });

    // socket.on('playerJoinedRoom', (players) => {
    //     setPlayers(players);
    // });

    return (
        <div>
            <div>
                <h3>Game configuration</h3>
                <h4>{codeSession}</h4>
                <p>Minutes to answer: {session.min_to_answer}</p>
            </div>
            <button>Ready to play</button>
            <div>
                {
                    players.map((player) => {
                        return (
                            <div key={player.teamName}>
                                <h3>{player.teamName}</h3>
                            </div>
                        )
                    })
                }
            </div>
            <BoardGame players={players}/>
        
        </div>
    )
}

export default TeamJoined
