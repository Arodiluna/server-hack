//Exportar express.
const { Router } = require('express');
//Express validator.
const { check } = require('express-validator');
const { registro } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar');
//Ruta.
const router = Router();


//Llamar controladores.


//Rutas endpoints
//Ruta insertar email.
//Ruta insertar email.
router.post('/email',
[
  check('email', 'No es un email válido.').isEmail(),
  validarCampos
],
registro);

module.exports = router;