const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { cargarArchivo, actualizarImagen, obtenerImagen, actualizarImagenCloudinary } = require('../controllers/upload');

const { validatorFields, tieneRol, validarJWT, validatorRoles } = require('../middlewares');
const { coleccionesPermitidas, existeUsuarioPorId } = require('../helpers');

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongoDB').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validatorFields
], obtenerImagen);

router.post('/', cargarArchivo);

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongoDB').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validatorFields
], actualizarImagenCloudinary);


module.exports = router;