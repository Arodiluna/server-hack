//Llamar express.
const { response } = require("express");
//Encriptar contraseñas.
const bcrypt = require("bcryptjs");
//Open ai.
const OpenAI = require("openai");

//Llamar s3.
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

//Uniqid
const uniqid = require('uniqid');
const { getDB } = require("../database/database");
const { generarJWT } = require("../helpers/jwt");

//Llamar api openAI.
const openai = new OpenAI({
    apiKey: process.env.API_OPENAI
});

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

//Subir audio.
//Subir Comprobando constancia fiscal.
const audio = async (req, res = response) => {

    //Crear objeto amazon s3 web service.
    const client = new S3Client({ region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ID,
            secretAccessKey: process.env.AWS_SECRET
        }
    });

    //Conexión base de datos.
    const conexion = await getDB();

    //Extraer id y nombre.
    const { id_usuario } = req;

    console.log(req.files.audio);

    //Validación.
    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subió ningún archivo.'
        });
    }

    //Nombre imagen por form data.
    const file = req.files.imagen;

    //Data de la imágen.
    const data = req.files.imagen.data;
    //Tipo de dato.
    const mimetype = req.files.imagen.mimetype;


    if (!file) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subió ningún archivo - pdf'
        });
    }

    if ( !file.mimetype.includes('pdf') ) {
        return res.status(400).json({
            ok: false,
            msg: 'El archivo no es un pdf'
        });
    }

    try {

        //Crear nombre archivo.
        const nombreOriginal = file.name;
        const nombreSplit = nombreOriginal.split('.');
        const extension = nombreSplit[ nombreSplit.length - 1 ];
        const id_unico = uniqid();
        //Ruta carpeta ine.
        const carpeta = `${ id_usuario }` + '/constancia-fiscal/';
        //Nomre archivo.
        const constancia_fiscal = `${ id_unico }.${ extension }`;
        //Nombre ruta.
        const ruta = carpeta + constancia_fiscal;


         //Parametros bucket.
        const params = {
          Bucket: process.env.AWS_NAME,
          Key: ruta, 
          Body: data,
          ContentType: mimetype
        };

         //Validar que exista el usuario.
         const searchUser = await conexion.query("SELECT COUNT(id_usuario) as user FROM documentos WHERE id_usuario = ?", id_usuario);

         //Extraer el numero de emails.
         const user = searchUser[0].user;
 
         datos = {
             id_usuario, constancia_fiscal
         }
 
         if (user === 0) {
                     //Insert.
         await conexion.query("INSERT INTO documentos SET ?", datos);
 
         //Enviar los parametros.
         const comando = new PutObjectCommand(params);
         //Esperando al cliente.
         await client.send(comando);
 
          res.json({
              ok: true,
              msg: 'Se inserto correctamente la imagen.',
              file: file.mimetype
          });
 
         }       

        //Validar si existe la imagen.
        const search = await conexion.query("SELECT COUNT(constancia_fiscal) as count FROM documentos WHERE id_usuario = ?", id_usuario);

        //Extraer el numero de emails.
        const contador = search[0].count;
        

        //Si no existe un INE en el ID usuario se hace el insert en AWS.
        if (contador === 0) {

        //Insert.
        await conexion.query("UPDATE documentos SET constancia_fiscal = ? WHERE id_usuario = ?", [constancia_fiscal, id_usuario]);

        //Enviar los parametros.
        const comando = new PutObjectCommand(params);
        //Esperando al cliente.
        await client.send(comando);

         res.json({
             ok: true,
             msg: 'Se inserto correctamente la constancia fiscal.',
             file: file.mimetype
         });
         
         //Actualizar nombre imagen en base de datos.
        } else if (contador === 1) {

        await conexion.query("UPDATE documentos SET constancia_fiscal = ? WHERE id_usuario = ?", [constancia_fiscal, id_usuario]);

        //Enviar los parametros.
        const comando = new PutObjectCommand(params);
        //Esperando al cliente.
        await client.send(comando);

        res.json({
            ok: true,
            msg: 'Se actualizo la constancia fiscal correctamente.',
            file: file.mimetype
        });
    }

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error, hablar con el administrador.'
        });
    }
}

//OpenAI
//Validar token.
const chatgpt = async (req, res = response) => {

    //Extraer id y nombre.
    const { mensaje } = req.body;

    try {

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: mensaje }],
            model: "gpt-3.5-turbo",
          });

          const msg = completion.choices[0].message.content;

        res.status(200).json({
            ok: true,
            mensaje: msg
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
    token,
    audio,
    chatgpt
}