const {updatePositionTeamFromSocket} = require('../teams');
const {updateChallengingInfo} = require('../sessions');
const RoomStore = require('../../classes/RoomStore');

async function updatePositions(player, io, challengePassed=false) {
    const gameId = player.gameId;
    RoomStore.modifyUser(gameId, player);
    const players = RoomStore.getUsersInRoom(gameId);

    const updateTeam = await updatePositionTeamFromSocket(player.teamName, 
        gameId, 
        player.flagActive, 
        player.positionActive, 
        player.prev_position);
    
    if(updateTeam == 1){
        const updateChallenge = await updateChallengingInfo(gameId, false, null, null);
        if(updateChallenge == 1){
            io.sockets.in(gameId).emit('resultChallenge', {player, challengePassed, players});
        } else {
            io.sockets.in(gameId).emit('status', "Error al actualizar los datos del challenge");
        }
    } else {
        io.sockets.in(gameId).emit('status', "Error al actualizar las posiciones del equipo");
    }
}

module.exports = {updatePositions};