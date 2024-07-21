class TurnsGame {
    constructor() {
        this.turns = new Map(); // Map<room, Array>
    }

    addUserHasThrown(room, user){
        if (!this.turns.has(room)) {
            this.turns.set(room, []);            
        } 
        this.turns.get(room).push(user);
    }

    getUsersHaveNotThrown(usersInRoom){
        return usersInRoom.filter(user => this.turns.get(user.gameId).includes(user));
    }

    getUsersHaveThrown(room){
        return this.turns.get(room);
    }

    clearUsers(room){
        return this.turns.set(room, []);
    }

}

module.exports = new TurnsGame();
