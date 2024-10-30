const mainGame = require('../mainGame');
const {validToken} = require('../../utils/jwt')

module.exports = (io) => {

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Sin token'));
        }

        const payload = await validToken(token);
        if (!payload) {
            return next(new Error('Token invalido'));
        }
        next();
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Initialize handlers
        mainGame(io, socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};