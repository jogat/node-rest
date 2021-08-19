const express = require('express');

class Server {

    constructor() {        

        this.app = express();
        this.port = process.env.PORT;
        this.prefix = process.env.PREFIX;
        
        //Middlewares
        this.middlewares();
        //Rutas de aplication
        this.routes();

    }

    middlewares() {

        // lectura y parseo de body
        this.app.use(express.json());
        // directrio publico
        this.app.use(express.static('public'));
    }

    routes() {

        this.app.use( this.ws('/v1'), require('../routes/v1.routes'))

    }

    ws(route) {
        return `${this.prefix}${route}`;
    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log('Servicor correindo en puerto: ', this.port);
        })
    }

}

module.exports = Server;