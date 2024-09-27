class TurnsGame {
    constructor() {
        this.turns = new Map(); // Map<room, Array>
        this.turnsTrivia = new Map();
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

    addTurnTrivia(room, idTeam){
        if (!this.turnsTrivia.has(room)) {
            this.turnsTrivia.set(room, []);  
            this.turnsTrivia.get(room).push(idTeam);          
        } else {
            const teamFound = this.turnsTrivia.get(room).find(idTeamFound => idTeamFound == idTeam );
            if(!teamFound){
                console.log('turnoAdd', idTeam);
                this.turnsTrivia.get(room).push(idTeam);
            }
        }
    }

    getTurnsTrivia(room){
        return this.turnsTrivia.get(room);
    }

    clearTurnsTrivia(room){
        return this.turnsTrivia.set(room, []);
    }

    isLastTurnTrivia(room){
        return this.turnsTrivia.get(room).length == 2;
    }

}

module.exports = new TurnsGame();
