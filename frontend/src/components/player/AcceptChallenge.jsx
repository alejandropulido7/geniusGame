import React, {useContext, useEffect, useState} from 'react'
import { SocketContext } from '../../context/SocketProvider';
import { CHALLENGES_IN_BOARD, BACK_HOME, TRIVIA_VS, FLAGS } from '../../utils/constants';

const AcceptChallenge = ({dataRenderChallenge, setOpenModalRoulette, opponents}) => {

    const {socket} = useContext(SocketContext);
    const [opponentSelected, setOpponentSelected] = useState({});
    const [flagStole, setFlagStole] = useState('');

    useEffect(() => {
        if(opponents.length == 1){
            setOpponentSelected(opponents[0]);
        }
    }, [])

    const findNameChallenge = (id) => {
        const challengeFound = CHALLENGES_IN_BOARD.find(challenge => challenge.id == id);
        if(challengeFound){
            return challengeFound.name;
        }
        return null
    }

    const activateChallenge = (activate) => {
        setOpenModalRoulette(false);
        if(activate){
            if(dataRenderChallenge.challenge == TRIVIA_VS){
                const dataOpponent = { opponentSelected, flagStole };
                socket?.emit('renderChallenge', {dataChallenge: dataRenderChallenge, dataOpponent});
            } else {
                socket?.emit('renderChallenge', {dataChallenge: dataRenderChallenge, dataOpponent: {}});
            }
        } else {
            socket?.emit('resultChallenge', {player: dataRenderChallenge.player, challengePassed: activate});
        }
    };

    const backHome = () => {
        setOpenModalRoulette(false);
        socket?.emit('backHome', dataRenderChallenge);
    };

    function handlerOpponentSelected(idTeam){
        const opponentSelectedFound = opponents.find(opponent => opponent.idTeam == idTeam);
        if(opponentSelectedFound){
            setOpponentSelected(opponentSelectedFound);
        }
    }

    function getNameFlag(idFlag){
        return FLAGS.find(flag => flag.id == idFlag);
    }

    return (
        <>
            {(dataRenderChallenge.challenge != BACK_HOME) 
            ?
            <div>
                <h3>Aceptas el reto de {findNameChallenge(dataRenderChallenge.challenge)}?</h3>  
                {opponents.length > 1 
                ? 
                <div>
                    <label>Elige a tu oponente</label>
                    <select className='select' value={opponentSelected?.idTeam} onChange={(event) => handlerOpponentSelected(event.target.value)}>
                        <option value="">Seleccione...</option>
                        {opponents.map (opponent => {
                            return <option key={opponent.id} value={opponent.id}>{opponent.teamName}</option>
                        })}
                    </select>
                </div>
                :
                <div>
                    <p>Tu oponente sera {opponentSelected?.teamName}</p>
                </div>
                }           
                { (opponentSelected && dataRenderChallenge.challenge == TRIVIA_VS) && 
                    <div>
                        {opponentSelected.flagsObtained?.length > 0
                        ?
                        <div>
                            <label>Elige a la bandera que quieres robar..</label>
                            <select className='select' value={flagStole} onChange={(event) => setFlagStole(event.target.value)}>
                                <option value="">Seleccione...</option>
                                {opponentSelected.flagsObtained.map ((flag, index) => {
                                    return <option key={index} value={flag}>{getNameFlag(flag)}</option>
                                })}
                            </select>
                        </div>
                        :
                        <div>
                            <p>El oponente no tiene banderas para robarle</p>
                        </div>
                        }
                    </div>
                }       
                <div className='flex gap-4'>
                    <button className='btn' onClick={() => activateChallenge(true)}>Si</button>
                    <button className='btn' onClick={() => activateChallenge(false)}>No</button>
                </div>
            </div>
            :
            <div>
                <h3>Te devolveremos al principio</h3>
                <button className='btn' onClick={backHome}>Ok 😥</button>
            </div>}      
        </>
    )
}

export default AcceptChallenge
