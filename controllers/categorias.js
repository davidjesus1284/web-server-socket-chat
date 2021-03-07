const { request, response } = require("express");

const { Categoria } = require('../models');
const { Usuario } = require('../models');


const getCategorias = async(req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
        const [totalCategorias, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite))
        ]);
        res.json({ totalCategorias, categorias });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};
const getCategoriaId = async(req = request, res = response) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
        res.json(categoria);
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};
const crearCategorias = async(req = request, res = response) => {


    try {
        const nombre = req.body.nombre.toUpperCase();
        const categoriaDB = await Categoria.findOne({ nombre });
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe.`
            });

        }
        const data = {
            nombre,
            usuario: req.usuario._id
        };

        const categoria = new Categoria(data);
        await categoria.save();
        res.status(201).json({
            msg: 'Servicio para crear categoria',
            data,
            categoria
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};
const actualizarCategoria = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id;
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};
const borrarCategorias = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

module.exports = {
    getCategorias,
    getCategoriaId,
    crearCategorias,
    actualizarCategoria,
    borrarCategorias
}