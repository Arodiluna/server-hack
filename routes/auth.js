//Exportar express.
const { Router } = require('express');
//Express validator.
const { check } = require('express-validator');
const { registro } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar');
//Ruta.
const router = Router();


//Rutas openAI.


//Rutas auth.
//Ruta insertar registro.
router.post('/registro', registro);

module.exports = router;