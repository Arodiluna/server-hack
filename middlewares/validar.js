//Llamar paquete express.
const { response } = require('express');
const { validationResult } = require('express-validator');

//Funcion express request and response.
const validarCampos = (req, res = response, next) => {
    
    //Manejo de errores.
    const errors = validationResult( req );

    if ( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}

//Exportar modulos.
module.exports = {
    validarCampos
}