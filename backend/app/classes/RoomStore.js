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

    addUserToRoom(room, user) {
        if (this.rooms.has(room)) {
            const users = this.rooms.get(room);           
            if (!users.has(user.idTeam)) {
                this.rooms.get(room).set(user.idTeam, user);
                this.userRooms.set(user, room);
            }
        }        
    }

    modifyUser(room, playerId, newUserData) {
        if (this.rooms.has(room)) {
            const users = this.rooms.get(room);
            if (users.has(playerId)) {
                const user = users.get(playerId);
                const updatedUser = { ...user, ...newUserData };
                users.set(playerId, updatedUser);
            }
        }
    }

    removeUserFromRoom(user) {
        const room = this.userRooms.get(user);
        if (room) {
            const users = this.rooms.get(room);
            users.delete(user);
            if (users.size === 0) {
                this.rooms.delete(room);
            }
            this.userRooms.delete(user);
        }
    }

    getUsersInRoom(room) {
        return this.rooms.has(room) ? Array.from(this.rooms.get(room).values()) : [];
    }

    getUserRoom(user) {
        return this.userRooms.get(user);
    }
}

// Export a single instance of RoomStore
module.exports = new RoomStore();
