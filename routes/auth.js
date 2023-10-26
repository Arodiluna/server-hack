//Exportar express.
const { Router } = require('express');
//Express validator.
const { check } = require('express-validator');
const { registro, login, token, audio, chatgpt, verEstudiantes } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar');
const { audioFun } = require('../controllers/openai');
const { validarJWT } = require('../middlewares/validar-jwt');
//Ruta.
const router = Router();


//Rutas openAI.
router.get('/audio', audioFun);

//Rutas auth.
//Ruta insertar registro.
router.post('/registro', 
[
check('nombre', 'El nombre es obligatorio.').not().isEmpty().isLength({ min: 1 }),
check('apellido_p', 'El apellido paterno es obligatorio.').not().isEmpty().isLength({ min: 1 }),
check('apellido_m', 'El apellido materno es obligatorio.').not().isEmpty().isLength({ min: 1 }),
check('usuario', 'El usuario es obligatorio.').not().isEmpty().isLength({ min: 1 }),
check('discapacidad', 'La discapacidad es obligatorio.').not().isEmpty().isLength({ min: 1 }),
check('email', 'No es un email válido.').isEmail(),
check('pass', 'La contraseña postal es obligatorio.').not().isEmpty().isLength({ min: 1 }),
validarCampos
], 
registro);

//Ruta login.
router.post('/login', 
[
check('email', 'No es un email válido.').isEmail(),
check('pass', 'La contraseña postal es obligatorio.').not().isEmpty().isLength({ min: 1 }),
validarCampos
], 
login);

//Renovar token.
router.get('/token', validarJWT , token);

//Subir audio.
router.post('/mensaje', validarJWT, chatgpt);

//Ver estudiantes.
router.post('/estudiantes', validarJWT, verEstudiantes);

module.exports = router;