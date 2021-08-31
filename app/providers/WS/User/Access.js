const customError = require('../../../helper/customError');
const Database = require('../../../db');
const User = require('../User');


class Access {

    #user;
    #db;

    constructor(database = Database, user = User,access = null) {
        this.#user = user;
        this.#db = database;
    }

    async get(slug=null) {

        try {

            const query = `SELECT access.*
            FROM (
                SELECT access as id
                FROM user_has_role
                LEFT JOIN user_role_has_access ON user_has_role.role=user_role_has_access.role
                WHERE user=?
                UNION
                SELECT access
                FROM user_has_access
                WHERE user=?
            ) as results
            LEFT JOIN access ON access.id=results.id`;

            let conn = await this.#db.getConnection();
            const [rows] = await conn.execute(query, [this.#user.id(), this.#user.id()]);
            conn.release();

            let access = [];

            rows.forEach((row)=> {

                if (slug!==null && slug=== row['slug']) {
                    return true;
                }

                if (slug===null && !access.includes(row['slug'])) {
                    access.push(row['slug'])
                }

            });

            if (slug!==null) {
                return false;
            }

            return access;

        } catch (err) {
            throw new customError(500, err.message)
        }

    }

    has(slug=null) {

        try {

            let userTokenInstance = this.#user.getTokenInstance();

            if ( userTokenInstance !== false) {

                if (slug === null) {
                    return userTokenInstance.access;
                }

                return userTokenInstance.access.includes(slug);

            }
        } catch (err) {
            throw new customError(500, err.message)
        }
    }

    get WRITE_OWN_POSTS() {
        return 'write-own-posts';
    }

}

module.exports = Access;