require('dotenv').config();
global.common = require('./app/helper/common');
const Server = require('./app/models/server');

const server = new Server();
server.listen();