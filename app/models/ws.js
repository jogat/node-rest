const configs = require("../../config");
const database = require('./db');

class WS {

    constructor() {
        this.db = database.init(configs.getDatabaseConfig())
    }

    session(userID) {
        const Session = require('./ws/session');
        return new Session(this.db, userID);
    }

    user(userID) {
        const User = require('./ws/user');
        return new User(this.db, userID);
    }

    setTenantDatabase(tenantToken) {
        let tenantId = 1;
        //@todo: get tenant id by tenantToken
        this.db = database.init(configs.getDatabaseConfig(tenantId))
    }

}

const ws = new WS();
Object.freeze(ws);

module.exports = ws;
