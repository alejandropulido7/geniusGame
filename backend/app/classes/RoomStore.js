// roomStore.js
class RoomStore {
    constructor() {
        this.rooms = new Map(); // Map<room, Set<user>>
        this.detailRooms = new Map(); //Map<room, details>
        this.userRooms = new Map(); // Map<user, room>
    }

    createNewRoom(room){
        const idRoom = room.gameId;
        if (!this.rooms.get(idRoom)) {
            this.detailRooms.set(idRoom, room);
            this.rooms.set(idRoom, new Set());
        }
    }

    addUserToRoom(room, user) {
        if (this.rooms.has(room)) {
            this.rooms.get(room).add(user);
            this.userRooms.set(user, room);
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
        return this.rooms.has(room) ? Array.from(this.rooms.get(room)) : [];
    }

    getUserRoom(user) {
        return this.userRooms.get(user);
    }
}

// Export a single instance of RoomStore
module.exports = new RoomStore();
