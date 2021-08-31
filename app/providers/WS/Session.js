const customError = require('../../helper/customError')
const WS = require('../WS')
const Database = require('../../db')

class Session {

    #db;
    #id;

    constructor(database = Database, user) {
        this.#db = database;
        this.#id = user;
    }

    async login(email, password, tenant, platform) {

        try {

            const query = "SELECT id, password FROM `user` WHERE status > 0 AND email = ? LIMIT 1";

            let conn = await this.#db.getConnection();
            const [rows] = await conn.execute(query, [email]);
            conn.release();

            if (!rows.length) {
                throw new customError(400, 'Not found user');
            }

            if (!Session.hashMatchPassword(rows[0]['password'], password)) {
                throw new customError(401, 'username or password is invalid');
            }

            this.#id = rows[0]['id'];
            this.tenant = tenant;
            this.platform = platform;

            return await this.#initiateSession();

        } catch(err) {
            throw new customError(err.code || 500, err.message);
        }

    }

    async #initiateSession() {

        let user = WS.user(this.#id);
        let accessTokenExpiration = parseInt(process.env.ACCESS_TOKEN_EXPIRATION);
        let issued = new Date();
        let expires = new Date(issued.getTime() + (accessTokenExpiration * 1000));
        let userData = {
            'info': await user.info(),
            'access': await user.access().get(),
            'meta': await user.meta(),
            'role': await user.role(),
            'issued': issued,
            'expires': expires
        }

        const jwt = require('jsonwebtoken');
        let accessToken = jwt.sign({
            info: userData.info,
            access: userData.access,
            meta: userData.meta,
            role: userData.role,
            tenant: this.tenant,
            platform: this.platform,

        }, process.env.JWT_KEY, { expiresIn: accessTokenExpiration });

        accessToken = `Bearer ${accessToken}`

        return {userData, accessToken};
    }

    static hashMatchPassword(passwordHash, password) {

        let bcrypt = require('bcrypt');
        passwordHash = passwordHash.replace('$2y$', '$2a$');
        return bcrypt.compareSync(password, passwordHash);

    }

}

module.exports = Session;