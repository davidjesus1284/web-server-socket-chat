const { Router } = require('express');
const { check } = require('express-validator');
const { validatorFields, tieneRol, validarJWT, validatorRoles } = require('../middlewares');
const {
    getCategorias,
    getCategoriaId,
    crearCategorias,
    actualizarCategoria,
    borrarCategorias
} = require('../controllers/categorias');
const { validarCategoriaID } = require('../helpers/db-validators');
const router = Router();

// Servicio publico para todas las categorias
router.get('/', getCategorias);

// Servicio para una categoria
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validarCategoriaID),
    validatorFields
], getCategoriaId);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validatorFields
], crearCategorias);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validarCategoriaID),
    validatorFields
], actualizarCategoria);

router.delete('/:id', [
    validarJWT,
    validatorRoles,
    // tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validarCategoriaID),
    validatorFields
], borrarCategorias);



module.exports = router;