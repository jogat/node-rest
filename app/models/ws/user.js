const customError = require('../../helper/customError')

class User {

    constructor(database, userID) {
        if (!userID || isNaN(userID)) {
            throw new customError(500, 'Missing user id');
        }
        this.id = userID;
        this.db = database;
    }

    async info() {

        const query = "SELECT * FROM `user` WHERE id = ? LIMIT 1";

        let conn = await this.db.getConnection();
        const [rows] = await conn.execute(query, [this.id]);
        conn.release();

        return {
            'id': rows[0]['id'],
            'email': rows[0]['email'],
            'name': {
                'first': rows[0]['first_name'],
                'last': rows[0]['last_name'],
            },
            'mod': rows[0]['updated_at'],
            'status': rows[0]['status'],
        }

    }

    async access(slug=null) {

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

        let conn = await this.db.getConnection();
        const [rows] = await conn.execute(query, [this.id, this.id]);
        conn.release();

        let access = [];

        rows.forEach((row)=> {

            if (slug!==null && slug=== row['slug']) {
                return true;
            }

            if(slug===null && !access.includes(row['slug'])) {
                access.push(row['slug'])
            }

        });

        if(slug!==null){
            return false;
        }

        return access;

    }

    async meta(slug=null) {

        const query = `SELECT *
                       FROM user_has_meta
                                LEFT JOIN user_meta ON user_has_meta.meta=user_meta.id
                       WHERE user_has_meta.user=?`;

        let conn = await this.db.getConnection();
        const [rows] = await conn.execute(query, [this.id]);
        conn.release();

        let meta = {};

        rows.forEach(function(row) {

            if(slug!==null && slug===row['slug']) {
                return row['value'];
            }

            if(slug===null) {
                meta[row['slug']] = row['value'];
            }

        });



        if(slug!==null){
            return false;
        }

        return meta;

    }

    async role(slug = null) {

        const query = `SELECT *
                       FROM user_has_role
                                LEFT JOIN user_role ON user_has_role.role=user_role.id
                       WHERE user_has_role.user=?`;

        let conn = await this.db.getConnection();
        const [rows] = await conn.execute(query, [this.id]);
        conn.release();

        let role = [];

        rows.forEach(function(row) {

            if(slug!==null && slug===row['slug']) {
                return row['value'];
            }

            if(slug===null) {
                role.push(row['slug']);
            }

        });

        if(slug!==null){
            return false;
        }

        return role;

    }


}

module.exports = User;