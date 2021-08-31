const express = require('express');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {        

        this.app = express();
        this.port = process.env.PORT;
        this.prefix = process.env.PREFIX;
        
        //Global Middlewares
        this.middlewares();
        //application routes
        this.routes();

    }

    middlewares() {
        // read and parse body
        this.app.use(express.json());
        //upload files
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '../storage/app/public/'
        }));
        // public directory
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use( `${this.prefix}/v1` , require('./routes/v1.routes'));
    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log('Running server in port: ', this.port);
        })
    }

}

module.exports = Server;