//Llamar express.
const { response } = require("express");
const { getDB } = require("../database/database");

const audio = async (req, res) => {
    try {
        const { email } = req.body;

        //Llamar la conexión a la base de datos.
        const conexion = await getDB();
        //Si const es igual a uno o mayor no hace el insert.

            //Respuesta si se insertan correctamente.
            res.status(201).json({
                ok: true,
                email: email,
                mensaje: "Se insertó el email correctamente",
                //query
            });

        //Error.
    } catch (error) {
        res.status(500).json({
            of: false,
            mensaje: "Hablar con un administrador, no se insertaron los datos en registro."
        });
    }
}



module.exports = {
    audio
}