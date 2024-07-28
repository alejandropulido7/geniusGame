import React, { useState, useEffect } from 'react'
import {getTeamByName} from '../../../services/teamService';

const ChooseTeamMember = ({member, setMember}) => {

    const [opponentMembers, setOpponentMembers] = useState([]);

    useEffect(() => {

        if(localStorage.getItem('dataChallenge-GG') != null){
  
          const data = JSON.parse(localStorage.getItem('dataChallenge-GG'));
          getTeamByName(data.player.teamName, data.player.gameId)
          .then(opponent => {
            setOpponentMembers(JSON.parse(opponent.players));
          })
          
        } 
      },[]);

      const playerTeamChanged = (event) => {
        const value = event.target.value;
        if(value != ''){
          setMember(event.target.value);
        }
      };

  return (
    <div>
      <h3>Quien quieres que resuelta el reto?</h3>
      <select value={member} onChange={playerTeamChanged}>
            <option value="">Selecciona a la victima..</option>
            {
              opponentMembers.map(member => {
                return (
                  <option key={member} value={member}>{member}</option>
                );
              })
            }
      </select>      
    </div>
  )
}

export default ChooseTeamMember
