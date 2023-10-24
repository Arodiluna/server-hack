const jwt = require('jsonwebtoken');
//Llamar dotenv.
require('dotenv').config();
//Generar tokken.
const generarJWT = (id_usuario, nombre) => {

    return new Promise( (resolve, reject) => {
        const payload = {id_usuario, nombre};

        jwt.sign( payload, process.env.SECRET_JWT, {
            expiresIn: '2h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el token.');
            }

            resolve( token );
            
        });
    })


}

module.exports = {
    generarJWT
}