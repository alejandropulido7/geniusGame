import React, { useEffect, useState, useContext } from 'react'
import {setCookie, deleteCookie, hasCookie, getCookie} from '../../utils/cookies'
import { Link, useNavigate, useParams } from 'react-router-dom';
import {getSession} from '../../services/sessionService'
import {createTeam} from '../../services/teamService'
import {validateSessionToken} from '../../services/authServices'
import AddPlayerToTeam from './AddPlayerToTeam';
import { FLAGS, PROP_PIECES } from '../../utils/constants';
import {generateUUID} from '../../utils/shared'
import {GlobalContext} from '../../context/GlobalContext'
import Piece from '../board/Piece';
import PropsPiece from '../board/PropsPiece';
import { MdGroups2 } from "react-icons/md";
import { FaFlag } from "react-icons/fa6";


const ConfigTeam = () => {

  const [sessionId, setSessionId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [flagSelected, setFlagSelected] = useState('');
  const navigate = useNavigate();
  const {setActiveChallenge} = useContext(GlobalContext);
  const {tokenAdmin} = useParams();
  const [pieceChose, setPieceChose] = useState(null);
  const [color, setColor] = useState("#cacaca");
  const [emoji, setEmoji] = useState('😀');
  const idTeamCookie = getCookie('idDevice-GG');
  const teamNameCookie = getCookie('teamName-GG');


  useEffect(() => {
    console.warn(flagSelected);
    if(teamNameCookie){
      setTeamName(teamNameCookie);
    }
    if(tokenAdmin){
      validateSessionToken(tokenAdmin)
        .then((session) => {
          setSessionId(session.idRoom)
        })
        .catch(() => {
          navigate('/');
        });
    } else {
      navigate('/');
    }

    return () => {
      setActiveChallenge(false);
    }
  },[]);

  const createTeamInRoom = async () => {    
    try {
      const sessionCreated = await getSession(sessionId);
      if(sessionCreated){
          const jsonPlayers = JSON.stringify(players);
          const payload = {
            id_session: sessionId,
            id_team: idTeamCookie,
            name_team: teamName,
            players: jsonPlayers,
            prop_piece: JSON.stringify({color, emoji}),
            flag_active: flagSelected
          }
          createTeam(payload)
            .then((team) => {
              if(!team.error){  
                setCookie('teamName-GG', team.teamName, 1);
                setCookie('idDevice-GG', team.idTeam, 1);       
                setCookie('token', team.token);                  
                navigate('/player/room/'+team.idRoom);
              } else {
                setError(team.error);
              }
            })
            .catch(err => {
              setError(err);
            });
      } else {
        setError('La sala no ha sido creada');
      }
    } catch (error) {
      setError('Error creando el equipo: '+error);
    }
  } 

  const handleFlag = (event) => {
    setFlagSelected(event.target.value);
  };

  const entrySessionGame = () => {  
    setError('');
    if(validateFields()){
      if(error == '') {        
        createTeamInRoom();        
      }
    };
  }

  const validateFields = () => {
    if(sessionId == ''){
      setError('Type the room code');
      return false;
    }
    if(teamName == ''){
      setError('Type some name for your team');
      return false;
    }
    if(players.length == 0){
      setError('Team dont have any players');
      return false;
    }
    if(flagSelected == ''){
      setError('Select one board to start');
      return false;
    }    
    return true;
  }

  const findPropPiece = () => {
    return PROP_PIECES.find(prop => prop.id == pieceChose);
  }

  return (
    <div className='bg-black p-3'>
      <div className='m-auto bg-white p-5 rounded-md' style={{width: '90%'}}>
        <div className='flex flex-col my-5'>
            <label>Sala: {sessionId} </label>
        </div>
        <div className='flex justify-between my-4'>
            <div className='flex items-center gap-2'><MdGroups2 size={30}/> <p>Nombre equipo: </p></div>
            <input maxLength={17} className='input' name='teamName' value={teamName} onChange={(e)=>setTeamName(e.target.value)}/>
        </div>
        <div>
          <AddPlayerToTeam players={players} setPlayers={setPlayers}/>
        </div>
        <div className='flex justify-between my-4'>
            <div className='flex items-center gap-2'><FaFlag size={24}/><p>Bandera inicial:</p></div>
            <select className='select' value={flagSelected} onChange={handleFlag}>
                <option value="">Selecciona...</option>
                {FLAGS.map (flag => {
                    return <option key={flag.id} value={flag.id}>{flag.name}</option>
                })}
            </select>
        </div>
        <div className='w-full my-7'>
          <PropsPiece color={color} setColor={setColor} emoji={emoji} setEmoji={setEmoji}/>
        </div>
        <div className='my-6 flex flex-col justify-center'>
          <label>Tu ficha:</label>
          <div className='flex justify-center'>
            <Piece teamName={teamName} w={200} h={200} color={color} emoji={emoji}/>
          </div>
        </div>
        <div>
              { error !=='' && 
                <p>Error: {error}</p>
              }
        </div>     
        
        <button className='btn border-0 bg-black text-white rounded-md' onClick={entrySessionGame}>Entrar</button>
        
      </div>
    </div>
  )
}

export default ConfigTeam
