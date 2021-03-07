const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validatorFields, validarJWT } = require('../middlewares');

const router = Router();

router.get('/', validarJWT, renovarToken);

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validatorFields
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validatorFields
], googleSignIn);


module.exports = router;