const detectMobileDevice = require('../utils/detectDevice');
const {updatePositionTeamFromSocket} = require('./teams');
const {updateTurnOfTeamFromSocket} = require('./sessions')

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

    gameSocket.on("renderChallenge", renderChallenge)

    gameSocket.on("resultChallenge", resultChallenge)

    gameSocket.on("actingAndWhistle", actingAndWhistle)

    gameSocket.on("startChallenge", startChallenge)


}


function createNewGame(data) {
    this.emit('createNewGame', {gameId: data.gameId, mySocketId: this.id});
    lenght_board = data.lenghtBoard;
    quantity_challenges = data.quantityChallenges;

    console.log('romm created');
    console.log(this.id);
    const foundBoard = boards.find(board => board.gameId == data.gameId);
    if(foundBoard){
        const boardUpdated = boards.map(board => board.gameId == data.gameId ? {...board, mySocketId: this.id} : board);
        boards = boardUpdated;
    } else {
        boards.push({gameId: data.gameId, mySocketId: this.id});
    }

    // Join the Room and wait for the other player
    this.join(data.gameId)
}

function startGame() {
    const player = players[0];
    updateTurnOfTeamFromSocket(player.gameId, true, player.teamName)
    .then(() => {
        io.sockets.in(player.gameId).emit('turnOf', player);
    })
    .catch(err => {
        console.error(err);
    });
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

    // io.sockets.in(gameId).emit('playerJoinedRoom', players.filter(player => player.gameId == gameId));
    io.sockets.in(gameId).emit('playerJoinedRoom', players);
    io.sockets.in(gameId).emit('otherPlayersJoinedRoom', players);

}

function throwDice (dataTeam) {
    const gameId = dataTeam.gameId;
    round.push(dataTeam)
    const playersNoThrow = players.filter(player => player.teamName != dataTeam.teamName);
    if(playersNoThrow.length != 0){
        updateTurnOfTeamFromSocket(gameId, true, playersNoThrow[0].teamName)
        .then(() => {
            io.sockets.in(gameId).emit('turnOf', playersNoThrow[0]);            
        })
        .catch(err => {
            console.error("Update turn to throw");
            console.error(err);
        });
    } else {        
        updateTurnOfTeamFromSocket(gameId, true, round[0].teamName)
        .then(() => {
            io.sockets.in(gameId).emit('turnOf', round[0]);
            round = [];           
        })
        .catch(err => {
            console.error("Update turn to throw");
            console.error(err);
        });
    }

    const playerMoved = players.find(player => player.teamName === dataTeam.teamName);
    if(playerMoved != undefined){
        const newPosition = playerMoved.positionActive + dataTeam.diceValue;
        if(newPosition <= lenght_board){
            const playerMovedModified = {...playerMoved};
            playerMovedModified.prev_position = playerMovedModified.positionActive;
            playerMovedModified.positionActive = newPosition;
            const prev_position = playerMoved.positionActive;
            const playerNewPosition = players.map(player => player.teamName == playerMoved.teamName ? {...player, prev_position: prev_position, positionActive: newPosition} : player);
            updatePositionTeamFromSocket(dataTeam.teamName, dataTeam.gameId, dataTeam.flagActive, newPosition, prev_position)
            .then(() => {
                players = playerNewPosition;
                io.sockets.in(gameId).emit('throwDice', {playermoved: playerMovedModified, players });  
            })
            .catch(err => {
                console.error(err)
            });

        }
    }
}

function renderChallenge(data) {
    if(data.challenge != ""){
        console.log(data);
        const playersNoChallenge = players.filter(player => player.teamName != data.player.teamName);
        const socketBoard = boards.find(board => board.gameId == data.player.gameId);
        console.log('boards');
        console.log(boards);
        console.log(socketBoard);
        const ramdomPlayerIndex = Math.floor(Math.random() * playersNoChallenge.length);
        io.sockets.in(data.player.gameId).emit('renderChallenge', {
            challenge: data.challenge,
            board: socketBoard ? socketBoard.mySocketId : '0',
            player: data.player,
            playerOpponent: playersNoChallenge[ramdomPlayerIndex]
        });
    }
}

function resultChallenge(data){

    console.log(data);
    const foundPlayer = players.find(player => player.socketId == data.playerId);
    if(foundPlayer){
        if(!data.challengePassed){
            const playersNewPosition = players.map(player => player.teamName == foundPlayer.teamName ? {...player, positionActive: foundPlayer.prev_position} : player);
            updatePositionTeamFromSocket(foundPlayer.teamName, foundPlayer.gameId, foundPlayer.flagActive, foundPlayer.prev_position, foundPlayer.prev_position)
            .then(() => {
                players = playersNewPosition;
                io.sockets.in(foundPlayer.gameId).emit('playerJoinedRoom', players);  
                io.sockets.in(foundPlayer.gameId).emit('resultChallenge',{challengePassed: false});
            })
            .catch(err => {
                console.error(err)
            });

        } else {
            io.sockets.in(foundPlayer.gameId).emit('resultChallenge',{challengePassed: true});
        }
    } 
}

function actingAndWhistle(data){
    const foundPlayer = players.find(player => player.socketId == data.socketId);
    if(foundPlayer){
        io.sockets.in(foundPlayer.gameId).emit('actingAndWhistle', data);
    }
}

function startChallenge(data){
    const foundPlayer = players.find(player => player.socketId == data.socketId);
    if(foundPlayer){
        io.sockets.in(foundPlayer.gameId).emit('startChallenge', data);
    }
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