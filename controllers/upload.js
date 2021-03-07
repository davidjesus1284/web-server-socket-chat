const path = require("path");
const fs = require("fs");
const { response } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const obtenerImagen = async(req, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let modelo;
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id: ${id}`
                    });
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${id}`
                    });
                }
                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' });
        }

        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                console.log("####### Entro en el segundo if ########");
                return res.sendFile(pathImagen);
            }
        }

        const pathNoImagen = path.join(__dirname, '../assets/img/no-image.jpg');
        res.sendFile(pathNoImagen);

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            error
        });
    }
};

const cargarArchivo = async(req, res = response) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            res.status(400).json({
                msg: "No hay archivos para subir",
            });
            return;
        }
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ nombre });

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            error
        });
    }
};

const actualizarImagen = async(req, res = response) => {
    try {
        const { id, coleccion } = req.params
        let modelo;
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id: ${id}`
                    });
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${id}`
                    });
                }
                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' });
        }

        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();
        res.json(modelo);

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            error
        });
    }
};

const actualizarImagenCloudinary = async(req, res = response) => {
    try {
        const { id, coleccion } = req.params
        let modelo;
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id: ${id}`
                    });
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${id}`
                    });
                }
                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' });
        }

        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
        await modelo.save();

        res.json(modelo);

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            error
        });
    }
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    obtenerImagen
};