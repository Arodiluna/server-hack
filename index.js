//Llamar express.
const express = require('express');
//Llamar dotenv.
require('dotenv').config();
//Crear app express.
const app = express();
//Cors.
const cors = require('cors');

//Lectura y parseo del body.
app.use( express.json() );

//Cors.
app.use( cors() );

//Escuchar peticiones.
app.listen( process.env.PORT, () => {
    console.log(`Corriendo servidor en puerto ${ process.env.PORT }`);
});

//Directorio publico.
app.use( express.static('public') );

//Rutas, registro-uno, login, mostrar.//
app.use('/api/auth', require('./routes/auth'));