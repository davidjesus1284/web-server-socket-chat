const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async(req, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
        const [totalUsuarios, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query).skip(Number(desde)).limit(Number(limite))
        ]);
        res.json({ totalUsuarios, usuarios });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

const postUsuarios = async(req, res = response) => {

    try {
        const { nombre, correo, password, rol } = req.body;
        const usuario = new Usuario({
            nombre,
            correo,
            password,
            rol
        });

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        res.json({
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

const putUsuarios = async(req, res = response) => {

    try {
        const { id } = req.params;
        const { password, google, correo, ...resto } = req.body;
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }
        const usuarioDB = await Usuario.findByIdAndUpdate(id, resto, { new: true });
        res.json(usuarioDB);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

const deleteUsuarios = async(req, res = response) => {

    try {
        const { id } = req.params;
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            mensaje: 'Error interno en el servidor'
        });
    }
};

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
};