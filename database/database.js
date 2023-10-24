//Importar mysql.
const mysql = require('promise-mysql');
require('dotenv').config();

//Crear conexión Mysql.
//Crear conexión createConnection.
const conector = mysql.createPool({
    host: process.env.HOST || '',
    user: process.env.USER || '',
    password: process.env.PASS || '',
    database: process.env.DATABASE || ''
}).catch((error) => {
      console.log('Error al conectarse', error);
});

//Metodo para retornar la base de datos.
const getDB = () => {   
    return conector;
}

//Exportar base de datos.
module.exports = {
    getDB
}