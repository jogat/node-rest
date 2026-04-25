const express = require('express');
const fileUpload = require('express-fileupload');
const configs = require('../config');
const database = require('./db');

class Server {

    constructor() {        

        this.app = express();
        this.port = process.env.PORT;
        this.prefix = process.env.PREFIX;
        this.db = database.knex(configs.getDatabaseConfig());
        
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

        if (process.env.DEBUG_MODE == "true") {
            this.app.use(function(req = request, res = response, next){  
                console.log(Date.now())              
                console.log({
                    method: req.method, 
                    url: req.url, 
                    body: req.body,
                    query: req.query
                })
                next();
            });
        }

        
    }

    routes() {
        this.app.use( `${this.prefix}/v1` , require('./routes/v1.routes'));
        this.app.use(require('./http/middleware/errorHandler'));
    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log('Running server in port: ', this.port);
        })
    }

}

module.exports = Server;
