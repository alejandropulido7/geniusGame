const mainGame = require('../mainGame');
const {validToken} = require('../../utils/jwt')

module.exports = (io) => {

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('No autorizado'));
        }
        const payload = await validToken(token);
        // if (payload.email == 'codingproactive@mail.com') {
        //     return next(new Error('Email no autorizado'));
        // }
        if(payload){
            socket.emailUser = payload.email;
        }
        next();
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('prueba', (data) => {
            console.log('dataPruebas', data)
            console.log(socket.emailUser);
        })

        // Initialize handlers
        mainGame(io, socket);

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};