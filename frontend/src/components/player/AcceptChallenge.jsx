import React, {useContext, useEffect, useRef, useState} from 'react'
import { SocketContext } from '../../context/SocketProvider';
import { CHALLENGES_IN_BOARD_PLUSTRIVIA, BACK_HOME, TRIVIA_VS, FLAGS, findFlagProperties, TRIVIA } from '../../utils/constants';
import StealFlag from '../challenges/common/StealFlag';
import SyncLoader from "react-spinners/SyncLoader";
import { AudioContext } from '../../context/AudioProvider';
import no_accept_challenge from '../../assets/audio/no_accept_challenge.mp3'
import accept_challenge from '../../assets/audio/accept_challenge.mp3'



const AcceptChallenge = ({dataRenderChallenge, setOpenModalRoulette, opponents}) => {

    const {socket} = useContext(SocketContext);
    const [opponentSelected, setOpponentSelected] = useState({});
    const [flagStole, setFlagStole] = useState('');
    const [showFlags, setShowFlags] = useState(false);
    const [flagsOpponent, setFlagsOpponent] = useState([]);
    const [challengeAcepted, setChallengeAcepted] = useState(false);
    const [error, setError] = useState('');
    const {playSound} = useContext(AudioContext);
    const acceptChallenge = useRef(new Audio(accept_challenge));
    const noAcceptChallenge = useRef(new Audio(no_accept_challenge));

    useEffect(() => {
        if(opponents.length == 1){
            setOpponentSelected(opponents[0]);
            if(dataRenderChallenge.challenge == TRIVIA_VS){
                setFlagsOpponent(opponents[0].flagsObtained == null ? [] : opponents[0].flagsObtained);
                setShowFlags(true);
            }
        }
    }, [opponentSelected, flagsOpponent])

    const findNameChallenge = (id) => {
        const challengeFound = CHALLENGES_IN_BOARD_PLUSTRIVIA.find(challenge => challenge.id == id);
        if(challengeFound){
            return challengeFound.name;
        }
        return null
    }

    const activateChallenge = (activate) => {
        setError('');
        setOpenModalRoulette(false);
        setChallengeAcepted(true);
        if(opponentSelected == null){
            setError('Error: Elija un oponente');
            return;
        }
        if(activate){
            playSound(acceptChallenge, 1);
            const dataOpponent = { opponentSelected, flagStole };
            socket?.emit('renderChallenge', {dataChallenge: dataRenderChallenge, dataOpponent});
        } else {
            playSound(noAcceptChallenge, 1);
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
            setFlagsOpponent(opponentSelectedFound.flagsObtained)
            setShowFlags(true);
        }
    }

    return (
        <>
            {(dataRenderChallenge.challenge != BACK_HOME) 
            ?
            <div className='flex flex-col gap-4'>
                <h3>Aceptas el reto de {findNameChallenge(dataRenderChallenge.challenge)}?</h3>  
                {dataRenderChallenge.challenge != TRIVIA && 
                <div>
                    {(opponents.length > 1) 
                    ? 
                    <div>
                        <label>Elige a tu oponente</label>
                        <select className='select' value={opponentSelected?.idTeam} onChange={(event) => handlerOpponentSelected(event.target.value)}>
                            <option value="">Seleccione...</option>
                            {opponents.map (opponent => {
                                return <option key={opponent.idTeam} value={opponent.idTeam}>{opponent.teamName}</option>
                            })}
                        </select>
                    </div>
                    :
                    <div>
                        <p>Tu oponente sera {opponentSelected?.teamName}</p>
                    </div>
                    }
                </div>
                }           
                { showFlags && (flagsOpponent && dataRenderChallenge.challenge == TRIVIA_VS) && 
                    <div>
                        {flagsOpponent.length > 0
                        ?
                        <div>
                            <StealFlag flagStole={flagStole} setFlagStole={setFlagStole} flagsOpponent={flagsOpponent}/>
                        </div>
                        :
                        <div>
                            <p>El oponente no tiene banderas para robarle</p>
                        </div>
                        }
                    </div>
                }
                { !challengeAcepted 
                ?        
                <div className='flex justify-around gap-4'>
                    <button className='btn bg-green-600 text-white' onClick={() => activateChallenge(true)}>Si</button>
                    <button className='btn bg-red-600 text-white' onClick={() => activateChallenge(false)}>No</button>
                </div>
                :
                <div>
                    <SyncLoader/>
                </div>
                }
                <div>{error && <p>{error}</p>}</div>
            </div>
            :
            <div>
                <h3>Te devolveremos al principio</h3>
                <button className='btn shadow-md shadow-black bg-red-600 text-white' onClick={backHome}>Ok 😥</button>
            </div>}      
        </>
    )
}

export default AcceptChallenge
