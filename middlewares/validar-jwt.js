const { response } = require('express');
const jwt = require('jsonwebtoken');

//Validar web tokken.
const validarJWT = (req, res = response, next) => {

    //x-token headers.
    const token = req.header('x-token');

    //Si no hay un token la petición no es válida.
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Acceso denegado.'
        });
    }

    try {
        const { id_usuario, nombre } = jwt.verify(
            token,
            process.env.SECRET_JWT
        );

        //Llamar id y nombre a través de payload.
        req.id_usuario = id_usuario;
        req.nombre = nombre;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no válido.'
        });
    }

    next();
}

module.exports = {
    validarJWT
}