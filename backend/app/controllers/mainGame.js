const detectMobileDevice = require('../utils/detectDevice');
const {updatePositionTeamFromSocket} = require('./teams');
const {updateTurnOfTeamFromSocket} = require('./sessions');
const RoomStore = require('../classes/RoomStore');
const TurnsGame = require('../classes/TurnsGame');

var io
var gameSocket
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

    gameSocket.on("startChallenge", startChallenge)

    gameSocket.on("stopChallenge", stopChallenge)

    gameSocket.on("validateChallenge", validateChallenge)

    gameSocket.on("notPassChallenge", notPassChallenge)


}


function createNewGame(data) {

    const room = {
        gameId: data.gameId, 
        mySocketId: this.id,
        lenght_board: data.lenghtBoard,
        quantity_challenges: data.quantityChallenges
    }
    RoomStore.createNewRoom(room);
    this.emit('createNewGame', room);
    // Join the Room and wait for the other player
    this.join(room.gameId)
}

function startGame(gameId) {
    const player = RoomStore.getUsersInRoom(gameId)[0];
    console.log(player);
    updateTurnOfTeamFromSocket(player.gameId, true, player.teamName)
    .then(() => {
        io.sockets.in(player.gameId).emit('turnOf', player);
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
    const playersNotThrown = TurnsGame.getUsersHaveNotThrown(usersInRoom);
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
    console.log("dataTeam", dataTeam)
    const gameId = dataTeam.gameId;
    const playerMoved = RoomStore.getUserRoom(gameId, dataTeam.idTeam);
    console.log("playerMoved", playerMoved)

    if(playerMoved != undefined){
        const newPosition = playerMoved.positionActive + dataTeam.diceValue;
        const room = RoomStore.getRoomDetails(gameId);
        if(newPosition <= room.lenght_board){
            let playerMovedModified = {...playerMoved};
            playerMovedModified.prev_position = playerMoved.positionActive;
            playerMovedModified.positionActive = newPosition;
            RoomStore.modifyUser(gameId, playerMovedModified);
            const players = RoomStore.getUsersInRoom(gameId);
            console.log('players', players);
            // const prev_position = playerMoved.positionActive;
            // const playerNewPosition = players.map(player => player.teamName == playerMoved.teamName ? {...player, prev_position: prev_position, positionActive: newPosition} : player);
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
    

    if(data.challenge != ""){
        const playersNoChallenge = players.filter(player => player.idTeam != data.player.idTeam);
        const socketBoard = RoomStore.getRoomDetails(gameId);       
        const ramdomPlayerIndex = Math.floor(Math.random() * playersNoChallenge.length);

        io.sockets.in(gameId).emit('renderChallenge', {
            challenge: data.challenge,
            board: socketBoard ? socketBoard.mySocketId : '0',
            player: data.player,
            playerOpponent: playersNoChallenge[ramdomPlayerIndex]
        });
    }
}

function notPassChallenge (data) {
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    if(foundPlayer){
        io.sockets.in(gameId).emit('notPassChallenge', foundPlayer);
    }
}

function resultChallenge(data){

    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    const challengePassed = data.challengePassed;

    if(foundPlayer){
        if(!challengePassed){
            let playerModified = {...foundPlayer};
            playerModified.positionActive = foundPlayer.prev_position;
            RoomStore.modifyUser(gameId, playerModified);
            // const playersNewPosition = players.map(player => player.teamName == foundPlayer.teamName ? {...player, positionActive: foundPlayer.prev_position} : player);
            updatePositionTeamFromSocket(foundPlayer.teamName, foundPlayer.gameId, foundPlayer.flagActive, foundPlayer.prev_position, foundPlayer.prev_position)
                .then(() => {
                    players = RoomStore.getUsersInRoom(gameId);  
                    io.sockets.in(gameId).emit('resultChallenge',{player: foundPlayer, challengePassed, players});
                })
                .catch(err => {
                    console.error(err)
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

function startChallenge(data){
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    if(foundPlayer){
        io.sockets.in(foundPlayer.gameId).emit('startChallenge', data);
    }
}

function stopChallenge(data){
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);
    if(foundPlayer){
        io.sockets.in(foundPlayer.gameId).emit('stopChallenge', foundPlayer);
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
    const gameId = data.gameId;
    const foundPlayer = RoomStore.getUserRoom(gameId, data.idTeam);

    if(foundPlayer){
        io.sockets.in(gameId).emit(nameEmit, data);
    }
}

function onDisconnect () {
    const idRoom = RoomStore.removeUserFromRoom(this.id);
    if(idRoom){
        io.sockets.in(idRoom).emit('playerJoinedRoom', RoomStore.getUsersInRoom(idRoom));
    }
    // playerDisconected = players.find(player => player.socketId == this.id);
    // players = players.filter(player => player != playerDisconected);
    // if(players.length > 0){
    //     io.sockets.in(players[0].gameId).emit('playerJoinedRoom', players);
    // }
}

module.exports = initializeGame