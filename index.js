//Llamar express.
const express = require('express');
//Llamar dotenv.
require('dotenv').config();
//Crear app express.
const app = express();
//Socket.io
const socketIO = require('socket.io');
//Http.
const http = require('http');
//Server express.
const server = http.createServer(app);
//Crear socket.io a través del server.
const io = socketIO(server, {
    cors: {
        origin: '*', // Cambia esto según tus necesidades de seguridad
        methods: ['GET', 'POST']
    }
});

//Abrir socket.
io.on('connection', (socket) => {
    console.log('Usuario conectado');
    logic.socketConexion(socket, io);
});

//Cors.
const cors = require('cors');

//Lectura y parseo del body.
app.use( express.json() );

//Cors.
app.use( cors() );

//Escuchar peticiones.
server.listen( process.env.PORT, () => {
    console.log(`Corriendo servidor en puerto ${ process.env.PORT }`);
});

//Directorio publico.
app.use( express.static('public') );

//Rutas, registro-uno, login, mostrar.//
app.use('/api/auth', require('./routes/auth'));