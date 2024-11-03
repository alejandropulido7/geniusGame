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
        socket.idRoom = payload.idRoom;
        next();
    });

    //PAYLOAD TOKEN
    // {
    //     "idRoom": "720916",
    //     "idHost": "xcye1bfezb7h",
    //     "idUser": 1,
    //     "iat": 1730504363,
    //     "exp": 1730590763
    //   }

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Initialize handlers
        mainGame(io, socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};