require('dotenv').config();
global.common = require('./app/helper/common');
const Server = require('./app/Server');

const server = new Server();
server.listen();