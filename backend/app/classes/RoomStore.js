// roomStore.js
class RoomStore {
    constructor() {
        this.rooms = new Map(); // Map<room, Map<id,user>>
        this.detailRooms = new Map(); //Map<room, details>
        this.userRooms = new Map(); // Map<user, room>
    }

    createNewRoom(room){ 
        const idRoom = room.gameId;
        if (!this.rooms.has(idRoom)) {
            this.rooms.set(idRoom, new Map());
        } 
        this.detailRooms.set(idRoom, room);
    }

    getRoomDetails(room){
        return this.detailRooms.get(room);
    }

    addUserToRoom(room, user) {
        if (this.rooms.has(room)) {
            const users = this.rooms.get(room);           
            if (!users.has(user.idTeam)) {
                this.rooms.get(room).set(user.idTeam, user); 
            } else {
                const userFound = users.has(user.idTeam);
                if(userFound.teamName != user.teamName){
                    this.rooms.get(room).set(user.idTeam, user);                
                } else {
                    this.modifyUser(room, user);
                }
            }
            this.userRooms.set(user.socketId, room); 
        }        
    }

    getRoomByIdSocket(id){
        return this.userRooms.has(id) ? this.userRooms.get(id) : '';
    }

    getUserBySocket(room, idSocket){
        let userFound = undefined;
        if(this.rooms.has(room)){
            const users = this.getUsersInRoom(room);
            userFound = users.find(user => user.socketId == idSocket);
        }
        return userFound;
    }

    modifyUser(room, newUserData) {
        const userId =  newUserData.idTeam;
        if (this.rooms.has(room)) {
            const users = this.rooms.get(room);
            if (users.has(userId)) {
                users.set(userId, newUserData);
            }
            
        }
    }

    removeUserFromRoom(idSocketToRemove) {
        let idRoom = undefined;
        
        if (this.userRooms.has(idSocketToRemove)) {
            idRoom = this.userRooms.get(idSocketToRemove);
            const room = this.rooms.get(idRoom);
            const arrayUsers = Array.from(room.values());
            const userToRemove = arrayUsers.find(player => player.socketId == idSocketToRemove);
            if(userToRemove){
                // room.delete(userToRemove.idTeam); 
                this.userRooms.delete(idSocketToRemove);               
            }
        }
        return idRoom;
    }

    getUsersInRoom(room) {
        return this.rooms.has(room) ? Array.from(this.rooms.get(room).values()) : [];
    }

    getUserRoom(room, idTeam) {
        const players = this.rooms.has(room) ? this.rooms.get(room) : undefined;
        let playerFinded = undefined;
        if(players && players.has(idTeam)){
            playerFinded = players.get(idTeam);
        }
        return playerFinded;
    }

    getOpponentsOfUser(room, idTeam){
        const users = getUsersInRoom(room);
        return users.filter(player => player.idTeam != idTeam);
    }

}

// Export a single instance of RoomStore
module.exports = new RoomStore();
