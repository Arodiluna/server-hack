//Llamar express.
const express = require('express');
//Llamar dotenv.
require('dotenv').config();
//Crear app express.
const app = express();

//Escuchar peticiones.
app.listen( process.env.PORT, () => {
    console.log(`Corriendo servidor en puerto ${ process.env.PORT }`);
});

//Directorio publico.
app.use( express.static('public') );