import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import socket from '../../config/socket';
import { getCookie } from '../../utils/cookies';
import OtherPlayers from './OtherPlayers';
import { Link, useNavigate } from 'react-router-dom';
import {getTeamByName} from '../../services/teamService'

const BoardPlayer = () => {

    const [codeSesion, setCodeSesion] = useState('');
    const [teamName, setTeamName] = useState('');    
    const {idRoom} = useParams();
    const [flagActive, setFlagActive] = useState('');
    const [positionActive, setPositionActive] = useState(1);
    const [diceResult, setDiceResult] = useState(0);
    const [youTurn, setYouTurn] = useState(false);
    const navigate = useNavigate();

    const getTeamCreated = async (idRoom) => {
        const nameTeamCookie = getCookie('teamName-GG');
        const teamCreatedinSession = await getTeamByName(nameTeamCookie, idRoom);
        if(!teamCreatedinSession) {
            navigate('../player')
        }else {
            setTeamName(nameTeamCookie);
            console.log(teamCreatedinSession)
            setFlagActive(teamCreatedinSession.flag_active);
            setPositionActive(teamCreatedinSession.position_active);
            socket.emit('joinPlayerGame', {
                gameId: teamCreatedinSession.id_session,
                teamName: teamCreatedinSession.name_team,
                flagActive: teamCreatedinSession.flag_active,
                positionActive: teamCreatedinSession.position_active
            });
            
        }
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
            flagActive
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
