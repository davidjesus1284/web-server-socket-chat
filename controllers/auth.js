const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { Usuario } = require('../models');
const { generarJWT } = require('../helpers');
const { googleVerify } = require('../helpers');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto'
            });
        }
        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto estado: false'
            });
        }
        // Verificar la contraseña 
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto password: no son iguales'
            });
        }
        // Implementar jwt
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrado'
        });
    }
};

const googleSignIn = async(req = request, res = response) => {


    try {
        const { id_token } = req.body;


        const { nombre, correo, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        console.log(usuario);
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Implementar jwt
        const token = await generarJWT(usuario.id);
        res.json({
            msg: 'Inicio de configuración google sign',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token de Google no es válido'
        })
    }

};

const renovarToken = async(req, res = response) => {
    try {
        const { usuario } = req;
        // Implementar jwt
        const token = await generarJWT(usuario.id);
        res.json({ usuario, token });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg: 'Error interno del servidor'
        });
    }
};


module.exports = {
    login,
    googleSignIn,
    renovarToken
};