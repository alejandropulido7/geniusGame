// roomStore.js
class RoomStore {
    constructor() {
        this.rooms = new Map(); // Map<room, Map<id,user>>
        this.detailRooms = new Map(); //Map<room, details>
        this.userRooms = new Map(); // Map<user, room>
    }

    createNewRoom(room){
        const idRoom = room.gameId;
        if (!this.rooms.get(idRoom)) {
            this.detailRooms.set(idRoom, room);
            this.rooms.set(idRoom, new Map());
        }
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
                const newSocketId = users.get(user.idTeam).socketId;
                this.userRooms.delete(newSocketId);
            }
            this.userRooms.set(user.socketId, room);
        }        
    }

    modifyUser(room, newUserData) {
        const userId =  newUserData.idTeam;
        if (this.rooms.has(room)) {
            const users = this.rooms.get(room);
            if (users.has(userId)) {
                const user = users.get(userId);
                const updatedUser = { ...user, ...newUserData };
                users.set(userId, updatedUser);
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
                room.delete(userToRemove.idTeam);
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
