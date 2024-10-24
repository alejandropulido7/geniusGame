const detectMobileDevice = require('../utils/detectDevice');
const {updatePositionTeamFromSocket, addFlagToTeam, removeFlagToTeam} = require('./teams');
const {updateTurnOfTeamFromSocket, updateChallengingInfo, updateChallengePassed, addTriviaVsToChallenges} = require('./sessions');
const RoomStore = require('../classes/RoomStore');
const TurnsGame = require('../classes/TurnsGame');
const GameState = require('../classes/GameState');
const {updatePositions} = require('../controllers/socketHandlers/commonOperations');
const {getConnectTrivia} = require('../controllers/trivia')

var io;
var gameSocket;


const initializeGame = (sio, socket) => {

    io = sio 
    gameSocket = socket 

    gameSocket.on("disconnect", onDisconnect)

    gameSocket.on("createNewGame", createNewGame)

    gameSocket.on("joinPlayerGame", joinPlayerGame)

    gameSocket.on("throwDice", throwDice)

    gameSocket.on("turnOf", turnOf)

    gameSocket.on("startGame", startGame)

    gameSocket.on("renderChallenge", renderChallenge)

    gameSocket.on("openModalConfirmation", openModalConfirmation)

    gameSocket.on("resultChallenge", resultChallenge)

    gameSocket.on("acting", acting)

    gameSocket.on("whistle", whistle)

    gameSocket.on("chainWords", chainWords)

    gameSocket.on("hunged", hunged)

    gameSocket.on("pictionary", pictionary)

    gameSocket.on("trivia", trivia)

    gameSocket.on("backHome", backHome)

    gameSocket.on("startChallenge", startChallenge)

    gameSocket.on("stopChallenge", stopChallenge)

    gameSocket.on("validateChallenge", validateChallenge)

    gameSocket.on("notPassChallenge", notPassChallenge)

    gameSocket.on("openModalRoulette", openModalRoulette);

    gameSocket.on("changeFlag", changeFlag); 

    gameSocket.on("stealFlag", stealFlag); 

    gameSocket.on("exitGamePlayer", exitGamePlayer);


}
 

function createNewGame(data) {

    const room = {
        gameId: data.gameId, 
        idDevice: data.idDevice,
        mySocketId: data.idSocket,
        lenght_board: data.lenghtBoard,
        quantity_challenges: data.quantityChallenges
    }
    RoomStore.createNewRoom(room);
    GameState.createGameStatus(room.gameId);
    // gameSocket.join(room.gameId);
    // io.sockets.in(room.gameId).emit('createNewGame', room);

    // this.emit('createNewGame', room);
    this.join(room.gameId);
}

async function startGame(gameId) {
    const player = RoomStore.getUsersInRoom(gameId)[0];
    const updateTurn = await updateTurnOfTeamFromSocket(player.gameId, true, player.teamName);
    if(updateTurn == 1){
        io.sockets.in(gameId).emit('startGame', {gameStarted: true});
        io.sockets.in(gameId).emit('turnOf', player);
    } else {
        io.sockets.in(gameId).emit('status', "Error actualizando el turno");
    }
} 

function joinPlayerGame(dataPlayer) {

    const gameId = dataPlayer.gameId;
    const room = io.sockets.adapter.rooms.get(gameId);

    if (room === undefined) {
        this.emit('status' , "This game session does not exist." );
        io.sockets.in(gameId).emit('sessionDontExist', false);
        return 
    }
 
    RoomStore.addUserToRoom(gameId, dataPlayer); 
    
    gameSocket.join(gameId);
    const playersInRoom = RoomStore.getUsersInRoom(gameId);
    
    io.sockets.in(gameId).emit('playerJoinedRoom', playersInRoom);
    io.sockets.in(gameId).emit('otherPlayersJoinedRoom', playersInRoom);

}

function turnOf(dataTeam){
    const gameId = dataTeam.player.gameId;
    TurnsGame.addUserHasThrown(gameId, dataTeam.player);
    const usersInRoom = RoomStore.getUsersInRoom(gameId);
    const playersNotThrown = TurnsGame.getUsersHaveNotThrown(gameId, usersInRoom);
    const usersThrown = TurnsGame.getUsersHaveThrown(gameId);
    let turnOf = {};

    if(playersNotThrown.length != 0){
        turnOf = playersNotThrown[0];
    } else {        
        turnOf = usersThrown[0];
        TurnsGame.clearUsers(gameId); 
    }

    updateTurnOfTeamFromSocket(gameId, true, turnOf.teamName)
        .then(() => {
            io.sockets.in(gameId).emit('turnOf', turnOf);            
        })
        .catch(err => {
            console.error("Update turn to throw");
            console.error(err);
        });
}

function throwDice (dataTeam) {
    const gameId = dataTeam.gameId;
    const playerMoved = RoomStore.getUserRoom(gameId, dataTeam.idTeam);
    if(playerMoved != undefined){
        const newPosition = playerMoved.positionActive + dataTeam.diceValue;
        const room = RoomStore.getRoomDetails(gameId);
        let isLastStep = false;
        let shouldMove = false;
        if(newPosition <= room.lenght_board){
            shouldMove = true;
            if(newPosition == room.lenght_board){
                isLastStep = true;
            }
            let playerMovedModified = {...playerMoved};
            playerMovedModified.prev_position = playerMoved.positionActive;
            playerMovedModified.positionActive = newPosition;
            RoomStore.modifyUser(gameId, playerMovedModified);
            const players = RoomStore.getUsersInRoom(gameId);
            updatePositionTeamFromSocket(dataTeam.teamName, dataTeam.gameId, dataTeam.flagActive, newPosition, playerMoved.positionActive)
            .then(() => {
                io.sockets.in(gameId).emit('throwDice', {playermoved: playerMovedModified, players, isLastStep, shouldMove });  
            })
            .catch(err => {
                console.error(err)
            });
        } else {
            io.sockets.in(gameId).emit('throwDice', {playermoved: playerMoved, shouldMove }); 
        }
    }
}

async function renderChallenge(data) {
    const gameId = data.dataChallenge.player.gameId;
    const challenge_name = data.dataChallenge.challenge; 

    if(challenge_name != ""){
        const socketBoard = RoomStore.getRoomDetails(gameId);      

        const participants = {
            board: socketBoard ? socketBoard.idDevice : '0',
            player: data.dataChallenge.player,
            playerOpponent: data.dataOpponent.opponentSelected
        }

        let dataRenderChallenge = {
            challenge: challenge_name,
            participants
        };
        if(challenge_name == 'trivia' || challenge_name == 'trivia_vs'){ 
           const dataTrivia = await getConnectTrivia();
           dataRenderChallenge.trivia = dataTrivia;
           dataRenderChallenge.dataOpponent = data.dataOpponent;
        }
        const participantsJson = JSON.stringify(participants);
        updateChallengingInfo(gameId, true, challenge_name, participantsJson)
            .then(() => {
                io.sockets.in(gameId).emit('renderChallenge', dataRenderChallenge);
            }).catch((error) => { 
                io.sockets.in(gameId).emit('status', error);
            });
    } 
}

function openModalConfirmation(data){
    const gameId = data.player.gameId;
    const players = RoomStore.getUsersInRoom(gameId); 
    const playersNoChallenge = players.filter(player => player.idTeam != data.player.idTeam);
    io.sockets.in(gameId).emit('openModalConfirmation', {challenge: data, opponents: playersNoChallenge}); 
}

function openModalRoulette(data){
    const gameId = data.data.player.gameId;
    const nameEmit = data.function;
    io.sockets.in(gameId).emit('openModalRoulette-'+nameEmit, data.data); 
}


function notPassChallenge (data) {
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    console.error('notPassChallenge', foundPlayer);
    if(foundPlayer){
        updateChallengePassed(gameId, false)
            .then(() => {
                io.sockets.in(gameId).emit('notPassChallenge', foundPlayer);
            })
            .catch((error) => {
                io.sockets.in(gameId).emit('status', error);
            })
        
    }
}

async function resultChallenge(data){ 

    const gameId = data.player.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.player.idTeam);
    const challengePassed = data.challengePassed;

    if(foundPlayer){
        if(!challengePassed){
            let playerModified = {...foundPlayer};
            playerModified.prev_position = foundPlayer.prev_position;
            playerModified.positionActive = playerModified.prev_position;
            updatePositions(playerModified, io);
        } else {
            const isLastStep = foundPlayer.isLastStep;
            if(isLastStep){
                const validateWinGame = await addFlagToTeam( foundPlayer.idTeam, gameId, foundPlayer.flagActive);
                foundPlayer.flagsObtained = validateWinGame.flagsObtained;
                RoomStore.modifyUser(gameId, foundPlayer);
                if(!validateWinGame.winGame){
                    const changePositions = await addTriviaVsToChallenges(gameId);
                    if(changePositions.length > 0){
                        io.sockets.in(gameId).emit('openModalChoiceNewFlag', {player: foundPlayer, changePositions});
                    }
                } else {
                    io.sockets.in(gameId).emit('winGame', foundPlayer);
                }
            } else { 
                updatePositions(foundPlayer, io, challengePassed);
            }
        }        
    } 
}

async function changeFlag(data) {
    const gameId = data.player.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.player.idTeam);
    if(foundPlayer){
        let playerModified = {...foundPlayer};
        playerModified.flagActive = data.newFlag;
        playerModified.positionActive = 1;
        playerModified.prev_position = 1;
        updatePositions(playerModified, io);
    }
}

async function updateStoleFlags(winner, loser, flagStole) {
    const gameId = winner.gameId;
    try {
        const removeFlag = await removeFlagToTeam(loser.idTeam, gameId, flagStole);
        if(removeFlag != null){
            loser.flagsObtained = removeFlag;
            RoomStore.modifyUser(gameId, loser);
            const validateWinGame = await addFlagToTeam(winner.idTeam, gameId, flagStole);
            winner.flagsObtained = validateWinGame.flagsObtained;
            RoomStore.modifyUser(gameId, winner);
            const players = RoomStore.getUsersInRoom(gameId);
            const updateChallenge = await updateChallengingInfo(gameId, false, null, null);
            if(updateChallenge == 1){
                if(validateWinGame.winGame){
                    io.sockets.in(gameId).emit('winGame', {foundPlayer: winner});
                } else {
                    io.sockets.in(gameId).emit('resultChallenge', {player: winner, challengePassed: true, players});
                }
            }
        } else {
            io.sockets.in(gameId).emit('status', 'No se pudo robar la bandera '+flagStole);
        }        
    } catch (error) {
        io.sockets.in(gameId).emit('status', error);
    }
}

async function stealFlag(data) {
    const gameId = data.playerPunisher.gameId;
    const opponent = RoomStore.getUserRoom(gameId, data.opponent.idTeam);
    const punisher = RoomStore.getUserRoom(gameId, data.playerPunisher.idTeam);
    if(punisher == null || opponent == null){
        io.sockets.in(gameId).emit('status', 'Error encontrando los jugadores');
        return;
    }
    const flagStole = data.flagStole;
    if(data.winner.idTeam == punisher.idTeam){
        if(flagStole != ''){
            updateStoleFlags(punisher, opponent, flagStole);
        } else {
            updatePositions(punisher, io);
        }
    } else if(data.winner.idTeam == opponent.idTeam){
        if(flagStole != ''){
            updateStoleFlags(opponent, punisher, flagStole);
        } else {
            let punisherModified = {...punisher};
            punisherModified.prev_position = punisher.prev_position;
            punisherModified.positionActive = punisherModified.prev_position;
            updatePositions(punisherModified, io);
        }
    }
    
}

function acting(data){
    emitDataOtherScreen('acting', data);
}

function whistle(data){
    emitDataOtherScreen('whistle', data); 
}

function chainWords(data){
    emitDataOtherScreen('chainWords', data);
}

function hunged(data){
    emitDataOtherScreen('hunged', data);
}

async function trivia(data){
    const nameEmit = data.function;
    const idSocket = data.data.socketId;
    const gameId = RoomStore.getRoomByIdSocket(idSocket);
    const foundPlayer = RoomStore.getUserBySocket(gameId, idSocket); 
    const roomDetails = RoomStore.getRoomDetails(gameId);
    if(roomDetails){
        const isLastStep = foundPlayer.positionActive == roomDetails.lenght_board ? true : false;
        foundPlayer.isLastStep = isLastStep;
    }
    if(gameId && foundPlayer){
        if(nameEmit == 'versus'){
            TurnsGame.addTurnTrivia(gameId, foundPlayer.idTeam);
            const isLastTurnTrivia = TurnsGame.isLastTurnTrivia(gameId);
            if(isLastTurnTrivia){
                const newQuestion = await getConnectTrivia();
                io.sockets.in(gameId).emit('trivia-'+nameEmit, {player: foundPlayer, data: data.data, isLastTurnTrivia: true, newQuestion});
                TurnsGame.clearTurnsTrivia(gameId);
            } else {
                io.sockets.in(gameId).emit('trivia-'+nameEmit, {player: foundPlayer, data: data.data, isLastTurnTrivia: false});
            }
        } else if(nameEmit == 'regular'){
            io.sockets.in(gameId).emit('trivia-'+nameEmit, {player: foundPlayer, response: data.data.response}); 
        }
    }
}

function pictionary(data){
    const nameEmit = data.function;
    emitDataOtherScreen('pictionary-'+nameEmit, data.data);
}

function backHome(data) {
    const gameId = data.player.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.player.idTeam);

    if(foundPlayer){
        let playerModified = {...foundPlayer};
        playerModified.positionActive = 1;
        playerModified.prev_position = 1;
        updatePositions(playerModified, io);
    }
}

function startChallenge(data){
    const gameId = RoomStore.getRoomByIdSocket(data.socketId);
    const user = RoomStore.getUserBySocket(gameId, data.socketId);
    io.sockets.in(gameId).emit('startChallenge', user);
}

function stopChallenge(data){
    const gameId = RoomStore.getRoomByIdSocket(data.socketId);
    const foundPlayer = RoomStore.getUserBySocket(gameId, data.socketId);
    const roomDetails = RoomStore.getRoomDetails(gameId);
    if(roomDetails){
        const isLastStep = foundPlayer.positionActive == roomDetails.lenght_board ? true : false;
        foundPlayer.isLastStep = isLastStep;
    }
    if(gameId && foundPlayer){
        io.sockets.in(gameId).emit('stopChallenge', foundPlayer); 
    }
}

function validateChallenge(data){
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    const playersOpponents = RoomStore.getOpponentsOfUser(gameId, data.idTeam);

    if(foundPlayer && playersOpponents.length > 0){
        io.sockets.in(gameId).emit('validateChallenge', {
            player: foundPlayer,
            opponent: playersOpponents[0]
        });
    }
}

function emitDataOtherScreen(nameEmit, data) {
    const gameId = RoomStore.getRoomByIdSocket(data.socketId); 
    io.sockets.in(gameId).emit(nameEmit, data);
}

function exitGamePlayer (idSocket) {
    const idRoom = RoomStore.removeUserFromRoom(idSocket);
    if(idRoom){
        io.sockets.in(idRoom).emit('playerJoinedRoom', RoomStore.getUsersInRoom(idRoom));
    }
}

function onDisconnect () {
    const idRoom = RoomStore.removeUserFromRoom(this.id);
    if(idRoom){
        io.sockets.in(idRoom).emit('playerJoinedRoom', RoomStore.getUsersInRoom(idRoom));
    }
}

module.exports = initializeGame