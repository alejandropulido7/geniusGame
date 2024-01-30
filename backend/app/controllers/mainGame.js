const detectMobileDevice = require('../utils/detectDevice');

var io
var gameSocket
// gamesInSession stores an array of all active socket connections
var players = [];
var boards = []


const initializeGame = (sio, socket) => {

    // initialize global variables.
    io = sio 
    gameSocket = socket 

    // Run code when the client disconnects from their socket session. 
    gameSocket.on("disconnect", onDisconnect)

    // User creates new game room after clicking 'submit' on the frontend
    gameSocket.on("createNewGame", createNewGame)

    // User creates new game room after clicking 'submit' on the frontend
    gameSocket.on("joinPlayerGame", joinPlayerGame)

    gameSocket.on("throwDice", throwDice)

}


function createNewGame(gameId) {
    console.log(gameId);
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('createNewGame', {gameId: gameId, mySocketId: this.id});

    console.log('romm created')
    console.log(this.id)
    boards.push(gameId)

    // Join the Room and wait for the other player
    this.join(gameId)
}

function joinPlayerGame(dataPlayer) {

    const currentSocket = this;
    const gameId = dataPlayer.gameId;
    const room = io.sockets.adapter.rooms.get(gameId);
    dataPlayer.socketId = this.id;    

    if (room === undefined) {
        this.emit('status' , "This game session does not exist." );
        return
    }

    if(players.find(player => player.teamName == dataPlayer.teamName)){ 
        this.emit('status' , "This name player already exist on the room." );
    } else if(dataPlayer.teamName !== ''){
        players.push(dataPlayer);
    }
    
    console.log(players)
    currentSocket.join(gameId);

    io.sockets.in(gameId).emit('playerJoinedRoom', players);
    io.sockets.in(gameId).emit('otherPlayersJoinedRoom', players);

}

function throwDice (dataTeam) {
    const gameId = dataTeam.gameId;
    console.log(dataTeam.diceValue);
    io.sockets.in(gameId).emit('throwDice', dataTeam);
}


function onDisconnect () {
    console.log('Device disconnect');
    playerDisconected = players.find(player => player.socketId == this.id);
    players = players.filter(player => player != playerDisconected);
    if(players.length > 0){
        io.sockets.in(players[0].gameId).emit('playerJoinedRoom', players);
    }
}

module.exports = initializeGame