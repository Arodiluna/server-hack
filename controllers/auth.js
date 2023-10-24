//Llamar express.
const { response } = require("express");
//Encriptar contraseñas.
const bcrypt = require("bcryptjs");
//
const uniqid = require('uniqid');
const { getDB } = require("../database/database");

const registro = async (req, res) => {

    try {
    //Imprimi fecha.
        let fecha = new Date();
        let day = fecha.getDate();
        let month = fecha.getMonth() + 1;
        let year = fecha.getFullYear();
        let fecha_creacion = `${year}-${month}-${day}`;

        //Hacer request de los datos enviados por JSON.
        var { pass } = req.body;
        const { nombre, apellido_p, apellido_m, usuario, discapacidad, fecha_nacimiento, email } = req.body;

        //Array de datos que harán insert, se agregan fecha_creacion y verificado
        datos = {
            nombre, apellido_p, apellido_m, usuario, discapacidad, fecha_nacimiento, email, pass, fecha_creacion
        }

        console.log(datos);

        //Encriptar contraseña.
        const salt = bcrypt.genSaltSync();
        datos.pass = bcrypt.hashSync( pass, salt );

        //Llamar la conexión a la base de datos.
        const conexion = await getDB();

        //Validar si existe un usuario con un email.
        const search = await conexion.query("SELECT COUNT(email) as count FROM usuario WHERE email = ?", email);

        //Extraer el numero de emails.
        const count = search[0].count;

        if ( count === 0 ) {

            //Creación del insert.
            await conexion.query("INSERT INTO usuario SET ?", datos);

            res.status(201).json({
                ok: true,
                mensaje: "Te registraste correctamente"
            });

        } else {
            //Respuesta si se insertan correctamente.
            res.status(400).json({
                ok: false,
                mensaje: "Existe un usuario con ese email"
            });
        }


        //Error.
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Hablar con un administrador, no se insertaron los datos en registro."
        });
    }
}



module.exports = {
    registro
}