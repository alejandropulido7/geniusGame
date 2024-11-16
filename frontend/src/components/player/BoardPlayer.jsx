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
import Confetti from 'react-confetti'
import { DataTeam } from './DataTeam';
import { KeepActiveBrowser } from '../common/KeepActiveBrowser';
import KeepAwakeComponent from '../common/KeepAwakeComponent';

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
    
    // useEffect(() => {
    //     setShowStartRoulette(true);
    //     const alreadyReloaded = localStorage.getItem('reloaded');
    //     if (!alreadyReloaded) {
    //       const timer = setTimeout(() => {
    //         localStorage.setItem('reloaded', 'true');
    //         window.location.reload();
    //       }, 50);
    
    //       return () => clearTimeout(timer);
    //     }
    //     return () => {
    //         setShowStartRoulette(true);
    //     }
    //   }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            if (!socket || !socket.connected) {
                console.log('reconectado')
              socket.connect(); // Intenta reconectar si está desconectado
            }
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, [socket]);
    

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
            localStorage.clear();
            deleteCookie('idDevice-GG')
            deleteCookie('teamName-GG');
            navigate('../');
        });
    }

    useEffect(() => {
        setIdTeam(idTeamCookie);
        setTeamName(nameTeamCookie);
        setCodeSesion(idRoom); 
        getTeamCreated(idRoom);
    }, [activeChallenge, socket]);


    useEffect(() => {   

        if(socket){
            socket.on('reloadClient', (data) => {  
                console.log('reload')
                window.location.reload();
            });

            socket.on('winGame', (data) => {  
                setGameFinished(true);  
                setWinner(data);
            });

            socket.on('status', (data) => {  
                console.log(data)
            });
            
            socket.on('sessionDontExist', () => {
                navigate('../player');
            });

            socket.on('renderChallenge', (data) => {
                setOpenModalRoulette(false);
                setShowStartRoulette(true);
                setOpenModal(false);
            });

            socket.on('resultChallenge', (data) => {
                setOpenModalRoulette(false);
                setOpenModalChoiceNewFlag(false);
                setInfoChoiceNewFlag({});
                setActiveChallenge(false);
                setOpenModal(false);
                setShowStartRoulette(true);
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
                if(idTeamCookie && data.player.idTeam == idTeamCookie){
                    setOpenModalChoiceNewFlag(true);
                    setInfoChoiceNewFlag(data.player);
                }
            });

            
            
            return () => {
                socket.off('resultChallenge');
                socket.off('openModalConfirmation');
                socket.off('openModalRoulette-rendering');
                socket.off('turnOf');
            }
        }
               
    },[activeChallenge, socket, 
        gameFinished, winner, 
        flagsObtained, openModalRoulette, 
        openModalChoiceNewFlag, openModal]);

    

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
        socket?.emit('changeFlag', {player: infoChoiceNewFlag, newFlag: newFlagSelected});
        setOpenModalChoiceNewFlag(false);
    };

    const findFlagProp = () => {
        const props = findFlagProperties(flagActive);
        return props!=null ? props : ''
    }

    const flagsMissing = () => {
        if(infoChoiceNewFlag.flagsObtained != null){
            const flagsToShow = FLAGS.filter(flag => !infoChoiceNewFlag.flagsObtained.includes(flag.id));
            return flagsToShow;
        }
        return [];
    }

    return (
        <div>
            <KeepAwakeComponent/>
            <div className={`board-player-container md:p-8 p-3 h-auto m-auto`}
                style={{backgroundColor: `${findFlagProp().color}`}}>
                { !gameFinished
                ?
                <div className='bg-white p-6 board-player-center rounded-md relative'>
                    { !activeChallenge && 
                    <div className='flex flex-col justify-around h-full'>
                        <div><PreventBackButton/></div>
                        <div className='mt-6'>
                            <DataTeam 
                                codeSesion={codeSesion} 
                                colorTable={findFlagProp().color}
                                flagActive={findFlagProp().name} 
                                teamName={teamName} 
                                flagsObtained={flagsObtained}
                            />
                        </div>
                        { youTurn && 
                        <div className='w-60 m-auto'>
                            <button className='btn btn-wood w-full text-white' onClick={throwDice}>Lanzar Dado</button>                            
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
                <div className='p-6'>
                    <AcceptChallenge dataRenderChallenge={dataRenderChallenge} setOpenModalRoulette={setOpenModalRoulette} opponents={opponentsChallenge}/>
                </div>
            </Modal>
            <Modal open={openModalRoulette} onClose={setOpenModalRoulette}>
                <div className='flex flex-col gap-4 p-6'>
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
                </div>
            </Modal>
            <Modal open={openModalChoiceNewFlag} onClose={setOpenModalChoiceNewFlag}>
                <Confetti style={{width: '100%'}}/>
                <div className='flex flex-col gap-6 p-6'>
                    <p>Felicidades equipo {infoChoiceNewFlag.teamName}!! Has ganado la bandera {findFlagProperties(infoChoiceNewFlag.flagActive)?.name}.</p>
                    <p>Escoge la siguiente:</p>
                    <div className='flex justify-center gap-4'>
                        <select className='select' value={newFlagSelected} onChange={(event) => setNewFlagSelected(event.target.value)}>
                            <option value="">Seleccione...</option>
                            {flagsMissing().map (flag => {
                                return <option key={flag.id} value={flag.id}>{flag.name}</option>
                            })}
                        </select>
                    </div>
                    <button onClick={confirmNewFlag} className='btn shadow-md shadow-black text-white' 
                        style={{backgroundColor: findFlagProperties(infoChoiceNewFlag.flagActive)?.color}}
                    >
                        Confirmar seleccion de bandera
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default BoardPlayer
