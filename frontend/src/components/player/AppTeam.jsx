import React, { useEffect, useState, useContext } from 'react'
import {setCookie, deleteCookie, hasCookie} from '../../utils/cookies'
import { Link, useNavigate } from 'react-router-dom';
import {getSession} from '../../services/sessionService'
import {createTeam} from '../../services/teamService'
import AddPlayerToTeam from './AddPlayerToTeam';
import { FLAGS } from '../../utils/constants';
import socket from '../../config/socket';
import {generateUUID} from '../../utils/shared'
import {GlobalContext} from '../../context/challenges/GlobalContext'

const AppTeam = () => {

  const [sessionId, setSessionId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [flagSelected, setFlagSelected] = useState('');
  const navigate = useNavigate();
  const {setActiveChallenge} = useContext(GlobalContext);

  useEffect(() => {
    deleteCookie('idDevice-GG');
    deleteCookie('teamName-GG');

    return () => {
      setActiveChallenge(false);
    }
  },[]);

  const createTeamInRoom = async (idTeam) => {
        
    const sessionCreated = await getSession(sessionId);
    if(sessionCreated){
        const jsonPlayers = JSON.stringify(players);
        const payload = {
          id_session: sessionId,
          id_team: idTeam,
          name_team: teamName,
          players: jsonPlayers,
          avatar: '',
          flag_active: flagSelected
        }
        createTeam(payload)
          .then((team) => {
            if(!team.error){  
              setCookie('idDevice-GG', idTeam, 1);
              // socket.emit('joinPlayerGame', {
              //   socketId: socket.id,
              //   idTeam: payload.id_team,
              //   gameId: payload.id_session,
              //   teamName: payload.name_team,
              //   flagActive: payload.flag_active,
              //   positionActive: 1,
              //   prev_position: 1
              // });                         
              navigate('../player/'+sessionId);
            } else {
              setError(team.error);
            }
          })
          .catch(err => {
            setError(err);
          });
    } else {
      setError('Room have not been created');
    }
  } 

  const handleFlag = (event) => {
    setFlagSelected(event.target.value);
  };

  const entrySessionGame = () => {  
    setError('');
    if(validateFields()){
      if(error == '') {
        setCookie('teamName-GG', teamName, 1);  
        const idTeam = generateUUID(10);
        createTeamInRoom(idTeam);        
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


  return (
    <div>
      <h1>Join in a Room</h1>
      <div className='flex gap-4'>
          <label>Type room code: </label>
          <input className='input' type='number' name='sessionId' onChange={(e)=>setSessionId(e.target.value)}/>
      </div>
      <div className='flex gap-4'>
          <label>Team name: </label>
          <input className='input' name='teamName' onChange={(e)=>setTeamName(e.target.value)}/>
      </div>
      <AddPlayerToTeam players={players} setPlayers={setPlayers}/>
      <div className='flex gap-4'>
          <label>Bandera inicial: </label>
          <select className='select' value={flagSelected} onChange={handleFlag}>
              <option value="">Seleccione...</option>
              {FLAGS.map (flag => {
                  return <option key={flag} value={flag}>{flag}</option>
              })}
          </select>
      </div>
      <div>
            { error !=='' && 
              <p>Error: {error}</p>
            }
      </div>     
      
      <button className='btn' onClick={entrySessionGame}>Start game</button>
    </div>
  )
}

export default AppTeam
