const detectMobileDevice = require('../utils/detectDevice');
const {updatePositionTeamFromSocket} = require('./teams');
const {updateTurnOfTeamFromSocket, updateChallengingInfo, updateChallengePassed} = require('./sessions');
const RoomStore = require('../classes/RoomStore');
const TurnsGame = require('../classes/TurnsGame');
const GameState = require('../classes/GameState');

var io;
var gameSocket;
// gamesInSession stores an array of all active socket connections
var players = [];
var boards = [];
var round = [];
var lenght_board = 0;
var quantity_challenges = 0;


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

    gameSocket.on("resultChallenge", resultChallenge)

    gameSocket.on("acting", acting)

    gameSocket.on("whistle", whistle)

    gameSocket.on("chainWords", chainWords)

    gameSocket.on("hunged", hunged)

    gameSocket.on("pictionary", pictionary)

    gameSocket.on("startChallenge", startChallenge)

    gameSocket.on("stopChallenge", stopChallenge)

    gameSocket.on("validateChallenge", validateChallenge)

    gameSocket.on("notPassChallenge", notPassChallenge)


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
    this.emit('createNewGame', room);
    this.join(room.gameId)
}

function startGame(gameId) {
    const player = RoomStore.getUsersInRoom(gameId)[0];
    console.log(player);
    updateTurnOfTeamFromSocket(player.gameId, true, player.teamName)
    .then((result) => {
        console.log('ResultStartGame', result);
        io.sockets.in(gameId).emit('turnOf', player);
    })
    .catch(err => {
        console.error(err); 
    });
} 

function joinPlayerGame(dataPlayer) {

    const gameId = dataPlayer.gameId;
    const room = io.sockets.adapter.rooms.get(gameId);
    dataPlayer.socketId = this.id;    

    if (room === undefined) {
        this.emit('status' , "This game session does not exist." );
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
        if(newPosition <= room.lenght_board){
            let playerMovedModified = {...playerMoved};
            playerMovedModified.prev_position = playerMoved.positionActive;
            playerMovedModified.positionActive = newPosition;
            RoomStore.modifyUser(gameId, playerMovedModified);
            const players = RoomStore.getUsersInRoom(gameId);
            updatePositionTeamFromSocket(dataTeam.teamName, dataTeam.gameId, dataTeam.flagActive, newPosition, playerMoved.positionActive)
            .then(() => {
                io.sockets.in(gameId).emit('throwDice', {playermoved: playerMovedModified, players });  
            })
            .catch(err => {
                console.error(err)
            });

        }
    }
}

function renderChallenge(data) {
    const gameId = data.player.gameId;
    const players = RoomStore.getUsersInRoom(gameId); 
    const challenge_name = data.challenge;

    if(challenge_name != ""){
        const playersNoChallenge = players.filter(player => player.idTeam != data.player.idTeam);
        const socketBoard = RoomStore.getRoomDetails(gameId);      
        const ramdomPlayerIndex = Math.floor(Math.random() * playersNoChallenge.length);

        const participants = {
            board: socketBoard ? socketBoard.idDevice : '0',
            player: data.player,
            playerOpponent: playersNoChallenge[ramdomPlayerIndex]
        }

        const dataRenderChallenge = {
            challenge: challenge_name,
            participants
        };
        const participantsJson = JSON.stringify(participants);
        updateChallengingInfo(gameId, true, challenge_name, participantsJson)
            .then(() => {
                io.sockets.in(gameId).emit('renderChallenge', dataRenderChallenge);
            }).catch((error) => { 
                io.sockets.in(gameId).emit('status', error);
            });
    }
}

function notPassChallenge (data) {
    console.log(data);
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
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

function resultChallenge(data){

    const gameId = data.player.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.player.idTeam);
    const challengePassed = data.challengePassed;

    if(foundPlayer){
        if(!challengePassed){
            let playerModified = {...foundPlayer};
            playerModified.prev_position = foundPlayer.prev_position??1;
            playerModified.positionActive = playerModified.prev_position;
            RoomStore.modifyUser(gameId, playerModified);
            const players = RoomStore.getUsersInRoom(gameId);
            updatePositionTeamFromSocket(playerModified.teamName, gameId, playerModified.flagActive, playerModified.positionActive, playerModified.prev_position)
                .then(() => {
                    updateChallengingInfo(gameId, false, null, null)
                    .then(() => {
                        io.sockets.in(gameId).emit('resultChallenge',{player: foundPlayer, challengePassed, players});
                    }).catch((error) => {
                        io.sockets.in(gameId).emit('status', error);
                    })
                })
                .catch(err => {
                    io.sockets.in(gameId).emit('status', err);
                });
        } else {
            io.sockets.in(gameId).emit('resultChallenge',{player: foundPlayer, challengePassed, players});
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

function pictionary(data){
    const nameEmit = data.function;
    emitDataOtherScreen('pictionary-'+nameEmit, data.data);
}

function startChallenge(data){
    const gameId = RoomStore.getRoomByIdSocket(data.socketId);
    const user = RoomStore.getUserBySocket(gameId, data.socketId);
    io.sockets.in(gameId).emit('startChallenge', user);
}

function stopChallenge(data){
    const gameId = RoomStore.getRoomByIdSocket(data.socketId);
    const foundPlayer = RoomStore.getUserBySocket(gameId, data.socketId);
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

function onDisconnect () {
    const idRoom = RoomStore.removeUserFromRoom(this.id);
    if(idRoom){
        io.sockets.in(idRoom).emit('playerJoinedRoom', RoomStore.getUsersInRoom(idRoom));
    }
}

module.exports = initializeGame