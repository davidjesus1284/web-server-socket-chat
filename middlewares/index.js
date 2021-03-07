const validarJWT = require('../middlewares/validar-jwt');
const validatorFields = require('../middlewares/validatorFields');
const validatorRoles = require('../middlewares/validator-roles');

module.exports = {
    ...validarJWT,
    ...validatorFields,
    ...validatorRoles
};