// roomStore.js
class GameState {
    constructor() {
        this.gameState = new Map(); // Map<room, status>
    }

    validateRoom(idRoom){
        return this.gameState.has(idRoom) ? true : false;
    }

    createGameStatus(idRoom){
        if(!this.validateRoom(idRoom)){
            this.gameState.set(idRoom, {});
        }
    }

    addGameStatus(idRoom, data){
        if(this.gameState.has(idRoom)){
            this.gameState.set(idRoom, data);
        }
    }

    getGameState(req, res){
        const response = {...this.gameState.get(req.params.idRoom)};
        res.status(200).json(response);
    }


}

// Export a single instance of RoomStore
module.exports = new GameState();
