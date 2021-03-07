const { Router } = require('express');
const { check } = require('express-validator');

const { validatorFields, tieneRol, validarJWT, validatorRoles } = require('../middlewares');
const { validarRolDB, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require('../controllers/users');

const router = Router();

router.get('/', getUsuarios);

router.post('/', [
    check('nombre', 'El nombre es obligatorio y no debe contener numeros').isString().not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail().custom(emailExiste),
    check('password', 'El password es obligatorio y minimo 6 digitos').not().isEmpty().isLength({ min: 6, max: 12 }),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']).not().isEmpty(),
    check('rol').custom(validarRolDB),
    validatorFields
], postUsuarios);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(validarRolDB),
    validatorFields
], putUsuarios);

router.delete('/:id', [
    validarJWT,
    // validatorRoles,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validatorFields
], deleteUsuarios);


module.exports = router;