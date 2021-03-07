const { Router } = require('express');
const { check } = require('express-validator');
const { validatorFields, tieneRol, validarJWT, validatorRoles } = require('../middlewares');
const {
    getProductos,
    getProductoId,
    crearProductos,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');
const { validarProductoID, validarCategoriaID } = require('../helpers/db-validators');
const router = Router();

router.get('/', getProductos);


router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validarProductoID),
    validatorFields
], getProductoId);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom(validarCategoriaID),
    validatorFields
], crearProductos);

router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un ID valido').isMongoId(),
    check('id').custom(validarProductoID),
    validatorFields
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    validatorRoles,
    // tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validarProductoID),
    validatorFields
], borrarProducto);

module.exports = router;