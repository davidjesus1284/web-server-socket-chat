require('dotenv').config();
const { Server } = require('./models');
const port = process.env.PORT;

const server = new Server();

server.listen(port);