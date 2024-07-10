const mainGame = require('../mainGame');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Initialize handlers
        mainGame(io, socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};