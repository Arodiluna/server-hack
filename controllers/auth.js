//Llamar express.
const { response } = require("express");
//Encriptar contraseñas.
const bcrypt = require("bcryptjs");
//
const uniqid = require('uniqid');
const { getDB } = require("../database/database");
const { generarJWT } = require("../helpers/jwt");


//Función registro.
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
        const { nombre, apellido_p, apellido_m, usuario, discapacidad, email } = req.body;

        //Array de datos que harán insert, se agregan fecha_creacion y verificado
        datos = {
            nombre, apellido_p, apellido_m, usuario, discapacidad, email, pass, fecha_creacion
        }

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
                mensaje: "Registro correcto"
            });

        } else {
            //Respuesta existe un usuario con ese email.
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


//Función login.
const login = async (req, res) => {


    try {
        //Llamar email y password.
        const { email, pass } = req.body;

        //Llamar base de datos.
        const conexion = await getDB();

        //Validar email.
        const search = await conexion.query("SELECT COUNT(*) as count FROM usuario WHERE email = ?", email);

        //Extraer el numero de emails.
        const contador = search[0].count;

        //Válidar password.
       const searchpass = await conexion.query("SELECT pass FROM usuario WHERE email = ?", email);
       
       //Accedemos al arreglo 0 tipo pass y hacemos la comparación.
       const validate = bcrypt.compareSync(  pass, searchpass[0].pass );

        //Si const es igual a uno o mayor no hace el insert.
        if (contador == 0) {
            //El email ya existe.
            res.status(400).json({
                ok: false,
                mensaje: "No hay un usuario con ese email."
            });
        }

        //Si no es verdadero.
         if ( !validate ) {
            //Validar password.
            res.status(400).json({
                ok: false,
                mensaje: "Contraseña incorrecta."
        });

        } else {

        //Si la contraseña es correcta.
        const datos = await conexion.query("SELECT id_usuario, nombre, discapacidad FROM usuario WHERE email = ?", email);
        // Extraer los datos de la consulta
          const id_usuario = datos[0].id_usuario;
          const nombre = datos[0].nombre;
          const discapacidad = datos[0].discapacidad;

        const token = await generarJWT( id_usuario, nombre );

        res.status(200).json({
            ok: true,
            id_usuario: id_usuario,
            nombre: nombre,
            discapacidad: discapacidad,
            token
        });
    }

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error, favor de hablar con el administrador."
        });
    }
}

//Validar token.
const token = async (req, res = response) => {

    //Extraer id y nombre.
    const { id_usuario, nombre } = req.header;

    //Generar un nuevo JWT y retornarlo en esta petición.
    const token = await generarJWT( id_usuario, nombre );

    try {
        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error renew token, favor de hablar con el administrador."
        });
    }
}


module.exports = {
    registro,
    login,
    token
}