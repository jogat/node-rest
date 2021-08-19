require('dotenv').config();
global.common = require('./helper/common');
const Server = require('./models/server');




const server = new Server();
server.listen();