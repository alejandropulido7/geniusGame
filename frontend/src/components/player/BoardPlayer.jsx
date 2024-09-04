import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom';
import socket from '../../config/socket';
import { getCookie, deleteCookie } from '../../utils/cookies';
import { Link, useNavigate } from 'react-router-dom';
import {getTeamById} from '../../services/teamService';
import {getSession} from '../../services/sessionService';
import BoardChallenges from '../challenges/BoardChallenges';
import { GlobalContext } from '../../context/challenges/GlobalContext';
import Modal from '../common/modal/Modal';
import {CHALLENGES_IN_BOARD, FLAGS} from '../../utils/constants';
import Winner from '../challenges/common/Winner';

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
    const [openModal, setOpenModal] = useState(false);
    const [openModalRoulette, setOpenModalRoulette] = useState(false);
    const [dataRenderChallenge, setDataRenderChallenge] = useState({});
    const [showStartRoulette, setShowStartRoulette] = useState(true);
    const [newFlagSelected, setNewFlagSelected] = useState('');
    const nameTeamCookie = getCookie('teamName-GG');
    const idTeamCookie = getCookie('idDevice-GG'); 
    const [gameFinished, setGameFinished] = useState(false);
    const [winner, setWinner] = useState({});
    const [openModalChoiceNewFlag, setOpenModalChoiceNewFlag] = useState(false);
    const [infoChoiceNewFlag, setInfoChoiceNewFlag] = useState({});

    

    const getTeamCreated = (idRoom) => {        
        getTeamById(idTeamCookie, idRoom)
        .then((teamCreatedinSession) => {
            setTeamName(nameTeamCookie);
            setIdTeam(idTeamCookie);
            console.log(teamCreatedinSession);
            setFlagActive(teamCreatedinSession.flag_active);
            setPrevPosition(teamCreatedinSession.prev_position)
            setPositionActive(teamCreatedinSession.position_active);
            socket.emit('joinPlayerGame', {
                socketId: socket.id,
                idTeam: teamCreatedinSession.id_team,
                gameId: teamCreatedinSession.id_session,
                teamName: teamCreatedinSession.name_team,
                flagActive: teamCreatedinSession.flag_active,
                positionActive: teamCreatedinSession.position_active,
                prev_position: teamCreatedinSession.prev_position
            });

            getSession(idRoom)
            .then((sessionCreated) => {
                console.log('sessionCreated', sessionCreated)
                if(sessionCreated.turnOf === nameTeamCookie){
                    setYouTurn(true);
                } else {
                    setYouTurn(false);
                }
            });
                       
        }).catch(()=>{
            localStorage.clear();
            deleteCookie('idDevice-GG')
            deleteCookie('teamName-GG');
            navigate('../player');
        });
    }

    useEffect(() => {
        setIdTeam(idTeamCookie);
        setTeamName(nameTeamCookie);
        setCodeSesion(idRoom); 
        getTeamCreated(idRoom);
    }, [activeChallenge]);


    useEffect(() => {
        socket.on('winGame', (data) => {  
            setGameFinished(true);  
            setWinner(data);
        });
    },[gameFinished, winner])

    socket.on('playerJoinedRoom', () => {
        console.log('-----------------playerJoinedRoom------------------')
    });

    useEffect(() => {   
        
        socket.on('sessionDontExist', () => {
            navigate('../player');
        });
        
        

        socket.on('resultChallenge', (data) => {
            console.log('resultChallenge', data);
            setActiveChallenge(false);
            setOpenModal(false);
            localStorage.clear();
        }); 

        socket.on('openModalConfirmation', (data) => {  
            const idTeam = getCookie('idDevice-GG'); 
            if(idTeam == data.player.idTeam){
                setOpenModal(true);
                setDataRenderChallenge(data);
                setOpenModalRoulette(false);
            }    
        });

        socket.on('openModalRoulette-rendering', (data) => {  
            const idTeam = getCookie('idDevice-GG'); 
            if(idTeam == data.player.idTeam){
                setOpenModalRoulette(true);
                setDataRenderChallenge(data);
            }    
        });

        socket.on('turnOf', (player) => {
            console.log('socket.id', socket.id);
            if(idTeamCookie && player.idTeam == idTeamCookie){
                console.log('turnOf', 'ENTRA EN TRUE');
                setYouTurn(true);
            } else {
                console.log('turnOf', 'ENTRA EN FALSE');
                setYouTurn(false);
            }
        });    
        
        socket.on('prueba', (player) => {
            console.log('prueba', player);
        }); 

        socket.on('openModalChoiceNewFlag', (data) => {
            console.log('openModalChoiceNewFlag', {idTeamCookie, data});
            if(idTeamCookie && data.idTeam == idTeamCookie){
                setOpenModalChoiceNewFlag(true);
                setInfoChoiceNewFlag(data);
            }
        });

        socket.on('changeFlag', (data) => {
            console.log('changeFlag', data)   
            setOpenModalChoiceNewFlag(false);
            setInfoChoiceNewFlag({});
            
            setActiveChallenge(false);
            setOpenModal(false);
            localStorage.clear();
        }); 
        
        return () => {
            socket.off('resultChallenge');
            socket.off('changeFlag');
            socket.off('openModalConfirmation');
            socket.off('openModalRoulette-rendering');
            socket.off('turnOf');
            setShowStartRoulette(true);
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

    const activateChallenge = (activate) => {
        setOpenModalRoulette(false);
        if(activate){
            socket.emit('renderChallenge', dataRenderChallenge);
        } else {
            socket.emit('resultChallenge', {player: dataRenderChallenge.player, challengePassed: activate});
        }
    };

    const findNameChallenge = (id) => {
        const challengeFound = CHALLENGES_IN_BOARD.find(challenge => challenge.id == id);
        if(challengeFound){
            return challengeFound.name;
        }
        return null
    }

    const startRoulette = () => {
        setShowStartRoulette(false);
        socket.emit('openModalRoulette', {function: 'startRoulette', data: dataRenderChallenge});
    }

    const stopRoulette = () => {
        socket.emit('openModalRoulette', {function: 'stopRoulette', data: dataRenderChallenge});
    }

    const confirmNewFlag = () => {     
        console.log('confirmNewFlag', {infoChoiceNewFlag, newFlagSelected });
        socket.emit('changeFlag', {player: infoChoiceNewFlag, newFlag: newFlagSelected});
        setOpenModalChoiceNewFlag(false);
    };

    return (
        <div>
            { !gameFinished
            ?
            <div>
                { !activeChallenge && 
                <div>
                    <h3>{codeSesion}</h3>
                    <h3>Your name: {teamName}</h3>
                    <h4>Board: {flagActive}</h4>
                    { youTurn && 
                    <div>
                        <button className='btn' onClick={throwDice}>Lanzar Dado</button>
                    </div>
                    }
                    <p>Resultado dado: {diceResult}</p>
                </div>}
                <BoardChallenges setOpenModal={setOpenModal} setOpenModalRoulette={setOpenModalRoulette}/>
            </div>
            :
            <Winner winner={winner}/>
            }


            <Modal open={openModal} onClose={setOpenModal}>
                <h3>Aceptas el reto de {findNameChallenge(dataRenderChallenge.challenge)}?</h3>
                <div className='flex gap-4'>
                    <button className='btn' onClick={() => activateChallenge(true)}>Si</button>
                    <button className='btn' onClick={() => activateChallenge(false)}>No</button>
                </div>
            </Modal>
            <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
                <h3>Gira la ruleta</h3>
                <div className="mt-8 space-x-4">
                {showStartRoulette 
                ?
                <button
                    onClick={startRoulette}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600" 
                >
                    Empezar a girar
                </button>
                :
                <button
                    onClick={stopRoulette}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                    Detener ruleta
                </button>}                
            </div>
            </Modal>
            <Modal open={openModalChoiceNewFlag} onClose={setOpenModalChoiceNewFlag}>
                <h3>Felicidades equipo {infoChoiceNewFlag.teamName}!! Has ganado la bandera {infoChoiceNewFlag.flagActive}.</h3>
                <p>Escoge la siguiente:</p>
                <div className='flex gap-4'>
                    <select className='select' value={newFlagSelected} onChange={(event) => setNewFlagSelected(event.target.value)}>
                        <option value="">Seleccione...</option>
                        {FLAGS.map (flag => {
                            return <option key={flag} value={flag}>{flag}</option>
                        })}
                    </select>
                </div>
                <button onClick={confirmNewFlag} className='btn'>
                    Confirmar seleccion de bandera
                </button>
            </Modal>
        </div>
    )
}

export default BoardPlayer
