const detectMobileDevice = require('../utils/detectDevice');
const {updatePositionTeamFromSocket} = require('./teams')

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

    gameSocket.on("startGame", startGame)


}


function createNewGame(data) {
    this.emit('createNewGame', {gameId: data.gameId, mySocketId: this.id});
    lenght_board = data.lenghtBoard;
    quantity_challenges = data.quantityChallenges;

    console.log('romm created')
    console.log(this.id)
    boards.push(data.gameId)

    // Join the Room and wait for the other player
    this.join(data.gameId)
}

function startGame() {
    const player = players[0];
    io.sockets.in(player.gameId).emit('turnOf', player);    
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

    io.sockets.in(gameId).emit('playerJoinedRoom', players.filter(player => player.gameId == gameId));
    io.sockets.in(gameId).emit('otherPlayersJoinedRoom', players);

}

async function throwDice (dataTeam) {
    const gameId = dataTeam.gameId;
    const playersNoThrow = players.filter(player => player.teamName != dataTeam.teamName);
    if(playersNoThrow.length != 0){
        io.sockets.in(gameId).emit('turnOf', playersNoThrow[0]);
    } else {
        io.sockets.in(gameId).emit('turnOf', round[0]);
        round = [];
    }

    const playerMoved = players.find(player => player.teamName === dataTeam.teamName);
    if(playerMoved != undefined){
        const newPosition = playerMoved.positionActive + dataTeam.diceValue;
        if(newPosition <= lenght_board){
            const playerNewPosition = players.map(player => player.teamName == playerMoved.teamName ? {...player, positionActive: newPosition} : player);
            const playerUpdated = await updatePositionTeamFromSocket(dataTeam.teamName, dataTeam.gameId, dataTeam.flagActive, newPosition);
            
            if(playerUpdated != 0){
                players = playerNewPosition;
                console.log(players)
            }
        }
    }
    io.sockets.in(gameId).emit('throwDice', players);

    
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