require("dotenv").config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io')
const syncDatabase = require('./app/config/syncDatabase');
const mainGame = require('./app/controllers/mainGame');
const socketHandlers = require('./app/controllers/socketHandlers')

const cors = require('cors');

const port = process.env.PORT || 5002;
const frontend = process.env.FRONTEND;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    // cookie: true,
    cors: { origin: frontend}
});


syncDatabase();

/*Manage all client request via socket*/
socketHandlers(io); 

app.use(express.json());
app.use(cors({
    origin: frontend
}));

app.use('/api', require('./app/routes'));

server.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
})