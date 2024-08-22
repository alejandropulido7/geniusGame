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

    getUsersHaveNotThrown(room, usersInRoom){
        const alreadyThrown = this.turns.get(room);

        return usersInRoom.filter(user => !alreadyThrown.some(userThrown => user.idTeam == userThrown.idTeam));
    }

    getUsersHaveThrown(room){
        return this.turns.get(room);
    }

    clearUsers(room){
        return this.turns.set(room, []);
    }

}

module.exports = new TurnsGame();
