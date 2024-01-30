require("dotenv").config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io')
const syncDatabase = require('./app/config/syncDatabase');
const mainGame = require('./app/controllers/mainGame')

const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cookie: true,
    cors: { origin: '*'}
});


syncDatabase();


io.on('connection', async (socket) => {
    console.log('Nuevo dispositivo conectado');
    mainGame(io, socket); 
    // io.sockets.in(gameId).
});

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/api', require('./app/routes'));

server.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
})