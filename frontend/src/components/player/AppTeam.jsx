import React, { useState  } from 'react'
import {setCookie, getCookie, hasCookie} from '../../utils/cookies'
import { Link, useNavigate } from 'react-router-dom';
import {getSession} from '../../services/sessionService'
import {createTeam} from '../../services/teamService'
import AddPlayerToTeam from './AddPlayerToTeam';
import { FLAGS } from '../../utils/constants';
import socket from '../../config/socket';

const AppTeam = () => {

  const [sessionId, setSessionId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [flagSelected, setFlagSelected] = useState('');
  const navigate = useNavigate();

  const getSessionCreated = async () => {
        
    const sessionCreated = await getSession(sessionId);
    if(sessionCreated){
        const jsonPlayers = JSON.stringify(players);
        console.log(jsonPlayers);
        createTeam(sessionId, teamName, jsonPlayers, '', flagSelected)
          .then((team) => {
            if(!team.error){                           
              navigate(sessionId);
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
    setCookie('teamName-GG', teamName, 1);  
    setError('');
    if(validateFields()){
      if(error == '') {
        socket.emit('joinPlayerGame', {
          gameId: sessionId,
          teamName: teamName,
          flagActive: flagSelected,
          positionActive: 1
        });
        getSessionCreated();
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
      <div>
          <label>Type room code: </label>
          <input type='number' name='sessionId' onChange={(e)=>setSessionId(e.target.value)}/>
      </div>
      <div>
          <label>Team name: </label>
          <input name='teamName' onChange={(e)=>setTeamName(e.target.value)}/>
      </div>
      <AddPlayerToTeam players={players} setPlayers={setPlayers}/>
      <div>
          <select value={flagSelected} onChange={handleFlag}>
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
      
      <button onClick={entrySessionGame}>Start game</button>
    </div>
  )
}

export default AppTeam
