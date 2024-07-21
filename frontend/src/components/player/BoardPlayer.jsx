import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom';
import socket from '../../config/socket';
import { getCookie, deleteCookie } from '../../utils/cookies';
import { Link, useNavigate } from 'react-router-dom';
import {getTeamById} from '../../services/teamService';
import {getSession} from '../../services/sessionService';
import BoardChallenges from '../challenges/BoardChallenges';
import { GlobalContext } from '../../context/challenges/GlobalContext';

const BoardPlayer = () => {

    const [codeSesion, setCodeSesion] = useState('');
    const [teamName, setTeamName] = useState(''); 
    const [idTeam, setIdTeam] = useState('');   
    const {idRoom} = useParams();
    const [flagActive, setFlagActive] = useState('');
    const [positionActive, setPositionActive] = useState(1);
    const [prevPosition, setPrevPosition] = useState(1);
    const [diceResult, setDiceResult] = useState(0);
    const [youTurn, setYouTurn] = useState(false);
    const navigate = useNavigate();
    const {activeChallenge, setActiveChallenge} = useContext(GlobalContext);

    const getTeamCreated = (idRoom) => {
        const nameTeamCookie = getCookie('teamName-GG');
        const idTeamCookie = getCookie('idTeam-GG'); 
        getTeamById(idTeamCookie, idRoom)
        .then((teamCreatedinSession) => {
            setTeamName(nameTeamCookie);
            setIdTeam(idTeamCookie);
            console.log(teamCreatedinSession);
            setFlagActive(teamCreatedinSession.flag_active);
            setPrevPosition(teamCreatedinSession.prev_position)
            setPositionActive(teamCreatedinSession.position_active);
            socket.emit('joinPlayerGame', {
                idTeam: teamCreatedinSession.id_team,
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

        socket.on('turnOf', (player) => {
            if(player.socketId == socket.id){
                setYouTurn(true);
            } else {
                setYouTurn(false);
            }
        });

        socket.on('resultChallenge', (data) => {      
            setActiveChallenge(false);
            localStorage.clear();
        });

        setCodeSesion(idRoom); 
        getTeamCreated(idRoom);  
        
        return () => {
            socket.off('turnOf');
            socket.off('resultChallenge');
        }
               
    },[activeChallenge]);

    

    const throwDice = () => {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        setDiceResult(randomNumber);
        setYouTurn(false);
        socket.emit('throwDice', {
            idTeam,
            gameId: codeSesion,
            teamName,
            diceValue: randomNumber,
            flagActive,
            prev_position: prevPosition
        });
      };

      
    

    return (
        <div>
            { !activeChallenge && 
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
            </div>}
            <BoardChallenges/>
        </div>
    )
}

export default BoardPlayer
