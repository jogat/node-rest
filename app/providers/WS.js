const configs = require("../../config");
const database = require('../db');

class WS {

    constructor() {
        this.db = database.init(configs.getDatabaseConfig())

    }

    session(userId) {
        const Session = require('./WS/Session');
        return new Session(this.db, userId);
    }

    user(userId) {
        const User = require('./WS/User');
        return new User(this.db, userId);
    }

    post(postId) {
        const Post = require('./WS/Post');
        return new Post(this.db, postId);
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
