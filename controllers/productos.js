const { request, response } = require("express");

const { Producto } = require('../models');

const getProductos = async(req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
        const [totalProductos, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre').skip(Number(desde)).limit(Number(limite))
        ]);
        res.json({ totalProductos, productos });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

const getProductoId = async(req = request, res = response) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id)
            .populate('usuario', 'nombre').populate('categoria', 'nombre');
        res.json(producto);
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};

const crearProductos = async(req = request, res = response) => {


    try {
        const { estado, usuario, ...body } = req.body;
        const productoDB = await Producto.findOne({ nombre: body.nombre });
        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe.`
            });

        }
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        };

        const producto = new Producto(data);
        await producto.save();
        res.status(201).json({
            data,
            producto
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};

const actualizarProducto = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        if (data.nombre) {
            data.nombre = data.nombre.toUpperCase();
        }
        data.usuario = req.usuario._id;
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

const borrarProducto = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

module.exports = {
    getProductos,
    crearProductos,
    getProductoId,
    actualizarProducto,
    borrarProducto
};