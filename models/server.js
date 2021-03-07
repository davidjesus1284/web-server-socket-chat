const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controllers');

class Server {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);
        // path de rutas
        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            upload: '/api/upload',
            usuarios: '/api/usuarios'
        };
        // Conectar a base de datos
        this.conectarDB();
        // Middleware
        this.middleware();

        // Rutas del servidor
        this.routes();

        // Sockets
        this.sockets();
    }

    middleware() {
        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
        // Directorio publico
        this.app.use(express.static('public'));
        // FileUpload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
        this.app.use(this.path.upload, require('../routes/upload'));
        this.app.use(this.path.usuarios, require('../routes/user'));


    }

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`Servidor iniciado en htts://localhost:${port}`);
        });
    }

    async conectarDB() {
        await dbConnection();
    }
}

module.exports = Server;