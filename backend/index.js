require("dotenv").config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io')
const syncDatabase = require('./app/config/syncDatabase');
const mainGame = require('./app/controllers/mainGame');
const socketHandlers = require('./app/controllers/socketHandlers')
const https = require('https');
const fs = require('fs');

const cors = require('cors');

const port = process.env.PORT || 5002;
const frontend = process.env.FRONTEND;
const app = express();
// Serve static files (React build or public directory)
app.use(express.static('build'));

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('../certs/localhost.key'),
  cert: fs.readFileSync('../certs/localhost.crt'),
};

const server = https.createServer(sslOptions, app);
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