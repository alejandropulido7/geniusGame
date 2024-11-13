import React from 'react'
import { findFlagProperties } from '../../../utils/constants';
import StealFlag from '../common/StealFlag';

export const ShowResult = ({dataChallenge, playerPunisher, playerOpponent, winner, flagStole, setFlagStole}) => {

    const showResult = () => {
        const flagStolePunisher = dataChallenge.dataOpponent.flagStole;
        if(playerPunisher.idTeam == winner.idTeam){
          if(flagStolePunisher == ''){
            return <p>El equipo {playerOpponent.teamName} no tiene banderas, asi que el equipo {playerPunisher.teamName} conserva su posicion</p>;
          } else {
            return <p>El equipo {playerPunisher.teamName} ha robado la bandera {findFlagProperties(flagStolePunisher).name}</p>;
          }
        } else if(playerOpponent.idTeam == winner.idTeam){
          if(playerPunisher.flagsObtained.length > 0){
            return <StealFlag flagStole={flagStole} setFlagStole={setFlagStole} flagsOpponent={playerPunisher.flagsObtained}/>
          } else {
            return <p>El equipo {playerPunisher.teamName} no tiene banderas, se regresa a la posicion anterior</p>
          }
        }
      }

    return (
        <div>ShowResult</div>
    )
}
