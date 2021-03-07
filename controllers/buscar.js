const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');
const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            result: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        result: usuarios
    });
};

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
        return res.json({
            result: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');
    res.json({
        result: categoria
    });
};

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');
        return res.json({
            result: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json({
        result: producto
    });
};

const buscar = (req = request, res = response) => {

    try {
        const { coleccion, termino } = req.params;

        if (!coleccionesPermitidas.includes(coleccion)) {
            return res.status(400).json({
                msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
            });
        }

        switch (coleccion) {
            case 'usuarios':
                buscarUsuarios(termino, res);
                break;
            case 'categorias':
                buscarCategorias(termino, res);
                break;
            case 'productos':
                buscarProductos(termino, res);
                break;

            default:
                res.status(500).json({
                    msg: 'Se le olvido hacer está busqueda'
                });
        }

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};

module.exports = {
    buscar
}