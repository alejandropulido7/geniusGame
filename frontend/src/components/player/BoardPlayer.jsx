import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom';
import { getCookie, deleteCookie } from '../../utils/cookies';
import { Link, useNavigate } from 'react-router-dom';
import {getTeamById} from '../../services/teamService';
import {getSession} from '../../services/sessionService';
import BoardChallenges from '../challenges/BoardChallenges';
import { GlobalContext } from '../../context/GlobalContext';
import Modal from '../common/modal/Modal';
import {CHALLENGES_IN_BOARD, FLAGS, findFlagProperties, BACK_HOME} from '../../utils/constants';
import Winner from '../challenges/common/Winner';
import './BoardPlayer.css'
import { SocketContext } from '../../context/SocketProvider';
import PreventBackButton from './PreventBackButton';
import AcceptChallenge from './AcceptChallenge';
import { FlagsPlayer } from '../challenges/common/FlagsPlayer';

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
    const [opponentsChallenge, setOpponentsChallenge] = useState([]);
    const [flagsObtained, setFlagsObtained] = useState([]);
    const {socket} = useContext(SocketContext);

    
    useEffect(() => {
        const alreadyReloaded = localStorage.getItem('reloaded');
        if (!alreadyReloaded) {
          const timer = setTimeout(() => {
            localStorage.setItem('reloaded', 'true');
            window.location.reload();
          }, 50);
    
          return () => clearTimeout(timer);
        }
      }, []);
    

    const getTeamCreated = (idRoom) => {        
        getTeamById(idTeamCookie, idRoom)
        .then((teamCreatedinSession) => {
            setTeamName(nameTeamCookie);
            setIdTeam(idTeamCookie);
            setFlagActive(teamCreatedinSession.flag_active);
            setPrevPosition(teamCreatedinSession.prev_position)
            setPositionActive(teamCreatedinSession.position_active);
            setFlagsObtained(JSON.parse(teamCreatedinSession.flags_obtained));
            if(socket){
                socket.emit('joinPlayerGame', {
                    socketId: socket.id,
                    idTeam: teamCreatedinSession.id_team,
                    gameId: teamCreatedinSession.id_session,
                    teamName: teamCreatedinSession.name_team,
                    flagActive: teamCreatedinSession.flag_active,
                    positionActive: teamCreatedinSession.position_active,
                    prev_position: teamCreatedinSession.prev_position,
                    propPiece: JSON.parse(teamCreatedinSession.prop_piece),
                    flagsObtained: JSON.parse(teamCreatedinSession.flags_obtained)
                });
            }

            getSession(idRoom)
            .then((sessionCreated) => {
                if(sessionCreated.turnOf === nameTeamCookie){
                    setYouTurn(true);
                } else {
                    setYouTurn(false);
                }
            });
                       
        }).catch((err)=>{
            console.log(err)
            localStorage.clear();
            deleteCookie('idDevice-GG')
            deleteCookie('teamName-GG');
            navigate('../');
        });
    }
//     Lobos = ["purple","red"]
//     Lobos2 = ["blue"]

    useEffect(() => {
        setIdTeam(idTeamCookie);
        setTeamName(nameTeamCookie);
        setCodeSesion(idRoom); 
        getTeamCreated(idRoom);
    }, [activeChallenge, socket]);


    useEffect(() => {   

        if(socket){
            socket.on('winGame', (data) => {  
                setGameFinished(true);  
                setWinner(data);
            });
            
            socket.on('sessionDontExist', () => {
                navigate('../player');
            });

            socket.on('renderChallenge', (data) => {
                setOpenModalRoulette(false);
                setOpenModal(false);
            });

            socket.on('resultChallenge', (data) => {
                setOpenModalChoiceNewFlag(false);
                setInfoChoiceNewFlag({});
                setActiveChallenge(false);
                setOpenModal(false);
                localStorage.clear();
            });

            socket.on('openModalConfirmation', (data) => {  
                const idTeam = getCookie('idDevice-GG'); 
                if(idTeam == data.challenge.player.idTeam){
                    setOpenModal(true);
                    setDataRenderChallenge(data.challenge);
                    setOpponentsChallenge(data.opponents);
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
                if(idTeamCookie && player.idTeam == idTeamCookie){
                    setYouTurn(true);
                } else {
                    setYouTurn(false);
                }
            });    

            socket.on('openModalChoiceNewFlag', (data) => {
                if(idTeamCookie && data.idTeam == idTeamCookie){
                    setOpenModalChoiceNewFlag(true);
                    setInfoChoiceNewFlag(data);
                }
            });

            
            
            return () => {
                socket.off('resultChallenge');
                socket.off('openModalConfirmation');
                socket.off('openModalRoulette-rendering');
                socket.off('turnOf');
            }
        }
        return () => {
            setShowStartRoulette(true);
        }
               
    },[activeChallenge, socket, gameFinished, winner, flagsObtained]);

    

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

    const startRoulette = () => {
        setShowStartRoulette(false);
        socket?.emit('openModalRoulette', {function: 'startRoulette', data: dataRenderChallenge});
    }

    const stopRoulette = () => {
        socket?.emit('openModalRoulette', {function: 'stopRoulette', data: dataRenderChallenge});
    }

    const confirmNewFlag = () => {     
        console.log('confirmNewFlag', {infoChoiceNewFlag, newFlagSelected });
        socket?.emit('changeFlag', {player: infoChoiceNewFlag, newFlag: newFlagSelected});
        setOpenModalChoiceNewFlag(false);
    };

    const findFlagProp = () => {
        const props = findFlagProperties(flagActive);
        return props!=null ? props : ''
    }

    // const flagsMissing = () => {
    //     const flagsToShow = infoChoiceNewFlag.flagsObtained.every(flagObtained => FLAGS.filter(flag => flag.id == flagObtained));
    //     return flagsToShow;
    // }

    return (
        <div>
            <div className={`board-player-container p-10 h-auto m-auto`}
                style={{backgroundColor: `${findFlagProp().color}`}}>
                { !gameFinished
                ?
                <div className='bg-white p-10 board-player-center rounded-md'>
                    { !activeChallenge && 
                    <div className='flex flex-col justify-between h-full'>
                        <div><PreventBackButton/></div>
                        <div className='flex justify-center gap-5'>
                            <p>Sesion: {codeSesion}</p>
                            <p>Tu equipo: {teamName}</p>
                            <p>Ruta: {flagActive}</p>
                            <FlagsPlayer flagsPlayer={flagsObtained}/>
                        </div>                        
                        { youTurn && 
                        <div className='w-60 m-auto'>
                            <button className='btn btn-wood w-full' onClick={throwDice}>Lanzar Dado</button>                            
                        </div>
                        }
                        {diceResult != 0 &&
                        <div>
                            <p>Resultado dado: {diceResult}</p>
                        </div>}
                        {!youTurn &&
                        <div>
                            <p>Espera tu turno...</p>
                        </div>}
                    </div>}
                    <BoardChallenges setOpenModal={setOpenModal} setOpenModalRoulette={setOpenModalRoulette}/>
                </div>
                :
                <Winner winner={winner}/>
                }                
            </div>


            <Modal open={openModal} onClose={setOpenModal}>
                <AcceptChallenge dataRenderChallenge={dataRenderChallenge} setOpenModalRoulette={setOpenModalRoulette} opponents={opponentsChallenge}/>
            </Modal>
            <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
                <p>Gira la ruleta</p>
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
                <p>Felicidades equipo {infoChoiceNewFlag.teamName}!! Has ganado la bandera {infoChoiceNewFlag.flagActive}.</p>
                {/* <p>{flagsMissing()}</p> */}
                <p>Escoge la siguiente:</p>
                <div className='flex gap-4'>
                    <select className='select' value={newFlagSelected} onChange={(event) => setNewFlagSelected(event.target.value)}>
                        <option value="">Seleccione...</option>
                        {FLAGS.map (flag => {
                            return <option key={flag.id} value={flag.id}>{flag.name}</option>
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
