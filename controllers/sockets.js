//Librerías.
//Importar mi conexión.
const { getDB } = require("../database/database");

//Funciones socket.
const socketConexion = async (socket, io) => {

    //Función notificación.
    socket.on('id_usuario', async (data) => {
        // Aquí puedes acceder a la data que se emitió con el evento 'id'
        //const id_usuario = data;
        //console.log(id_usuario); // Supongo que 'id' es una propiedad de la data

        // Realiza la lógica para obtener datos de la base de datos usando el idUsuario
        // En este caso, estoy simulando la llamada a la base de datos
        //const conexion = await getDB();
        //const query = await conexion.query(`CALL notificacion(${id_usuario})`);
        
        // Emite un evento 'mensaje' con los datos obtenidos de la base de datos
        //io.emit('mensaje', query[0]);

        //Función salas 
    const idHandShake = socket.id;
    const { nameRoom } =socket.HandShake.query;
    console.log(`Nuevo dispositivo conectado: ${id_handshake} => ${nameRoom}`)
    });

    
};

module.exports = {
    socketConexion
};