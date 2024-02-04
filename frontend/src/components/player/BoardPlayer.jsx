import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import socket from '../../config/socket';
import { getCookie } from '../../utils/cookies';
import OtherPlayers from './OtherPlayers';
import { Link, useNavigate } from 'react-router-dom';
import {getTeamByName} from '../../services/teamService';
import {getSession} from '../../services/sessionService';

const BoardPlayer = () => {

    const [codeSesion, setCodeSesion] = useState('');
    const [teamName, setTeamName] = useState('');    
    const {idRoom} = useParams();
    const [flagActive, setFlagActive] = useState('');
    const [positionActive, setPositionActive] = useState(1);
    const [prevPosition, setPrevPosition] = useState(1);
    const [diceResult, setDiceResult] = useState(0);
    const [youTurn, setYouTurn] = useState(false);
    const navigate = useNavigate();

    const getTeamCreated = (idRoom) => {
        const nameTeamCookie = getCookie('teamName-GG');
        getTeamByName(nameTeamCookie, idRoom)
        .then((teamCreatedinSession) => {
            setTeamName(nameTeamCookie);
            console.log(teamCreatedinSession);
            setFlagActive(teamCreatedinSession.flag_active);
            setPrevPosition(teamCreatedinSession.prev_position)
            setPositionActive(teamCreatedinSession.position_active);
            socket.emit('joinPlayerGame', {
                gameId: teamCreatedinSession.id_session,
                teamName: teamCreatedinSession.name_team,
                flagActive: teamCreatedinSession.flag_active,
                positionActive: teamCreatedinSession.position_active
            });
            getSession(idRoom)
            .then((sessionCreated) => {
                if(sessionCreated.turnOf == nameTeamCookie){
                    setYouTurn(true);
                }
            })
        }).catch(()=>{
            navigate('../player')
        });
    }

    useEffect(() => {

        setCodeSesion(idRoom); 
        getTeamCreated(idRoom);             
               
    },[]);

    socket.on('turnOf', (player) => {
        if(player.socketId == socket.id){
            setYouTurn(true);
        } else {
            setYouTurn(false);
        }
    })

    const throwDice = () => {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        setDiceResult(randomNumber);
        socket.emit('throwDice', {
            gameId: codeSesion,
            teamName,
            diceValue: randomNumber,
            flagActive,
            prev_position: prevPosition
        });
      };

      
    

    return (
        <div>
            <h3>{codeSesion}</h3>
            <h3>Your name: {teamName}</h3>
            <h4>Board: {flagActive}</h4>
                {/* <OtherPlayers/> */}
            { youTurn && 
            <div>
                <button onClick={throwDice}>Lanzar Dado</button>
            </div>
            }
            <p>Resultado dado: {diceResult}</p>
            
        </div>
    )
}

export default BoardPlayer
