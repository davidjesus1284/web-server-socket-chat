const { Categoria, Role, Usuario, Producto } = require('../models');

const validarRolDB = async(rol = '') => {
    const existRoles = await Role.findOne({ role: rol });
    if (!existRoles) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }

};

const emailExiste = async(correo) => {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe, por favor ingrese un nuevo correo`);
    }
};

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
};

const validarCategoriaID = async(id) => {
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id: ${id} no existe`);
    }
};

const validarProductoID = async(id) => {
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El id: ${id} no existe`);
    }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }
    return true;
};

module.exports = {
    validarRolDB,
    emailExiste,
    existeUsuarioPorId,
    validarCategoriaID,
    validarProductoID,
    coleccionesPermitidas
};