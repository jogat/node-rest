const configs = require("../config");
const database = require('./db');
const Session = require('./ws/session');


class WS {

    constructor() {
        // @todo: implement dynamic database name
        this.db = database.init(configs.getDatabaseConfig())
    }

    session() {
        return new Session(this.db);
    }

}

module.exports = new WS();