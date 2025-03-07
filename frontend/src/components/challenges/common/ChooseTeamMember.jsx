import React, { useState, useEffect } from 'react'
import {getTeamByName} from '../../../services/teamService';
import {getSession} from '../../../services/sessionService';
import {useParams} from 'react-router-dom';

const ChooseTeamMember = ({member, setMember}) => {

    const [opponentMembers, setOpponentMembers] = useState([]);
    const {idRoom} = useParams();

    useEffect(() => {

      getSession(idRoom)
        .then((session) => {
            const data = JSON.parse(session.challenge_participants);
            getTeamByName(data.player.teamName, idRoom)
              .then(opponent => {
                setOpponentMembers(JSON.parse(opponent.players));
              });
        });

      },[]);

      const playerTeamChanged = (event) => {
        const value = event.target.value;
        if(value != ''){
          setMember(event.target.value);
        }
      };

  return (
    <div className='flex flex-col gap-1'>
      <h3>Quien quieres que resuelva el reto?</h3>
      <select className='select' value={member} onChange={playerTeamChanged}>
            <option value="" className='text-center'>Selecciona a la victima..</option>
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
