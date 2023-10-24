//Llamar express.
const { response } = require("express");
const { getDB } = require("../database/database");

const registro = async (req, res) => {
    try {
        const { email } = req.body;

        //Llamar la conexión a la base de datos.
        const conexion = await getDB();
        //Si const es igual a uno o mayor no hace el insert.
        if (count === 1) {
            //El email ya existe.
            res.status(400).json({
                ok: false,
                mensaje: "El usuario ya está en uso."
            });

        } else {
            //El email no existe.
            //Creación del insert.
            await conexion.query("UPDATE usuarios_uno SET usuario = ? WHERE id_usuario = ?", [usuario, id_usuario]);

            //Respuesta si se insertan correctamente.
            res.status(201).json({
                ok: true,
                mensaje: "Se insertó el usuario correctamente",
                //query
            });
        }

        //Error.
    } catch (error) {
        res.status(500).json({
            of: false,
            mensaje: "Hablar con un administrador, no se insertaron los datos en registro."
        });
    }
}

module.exports = {
    registro
}