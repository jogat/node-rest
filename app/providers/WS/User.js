const customError = require('../../helper/customError');
const Database = require('../../db');

class User {

    #id;
    #db;
    #token_instance;

    constructor(database = Database, userID = 0) {
        this.#id = userID;
        this.#db = database;
    }

    async info() {

        try {

            const query = "SELECT * FROM `user` WHERE id = ? LIMIT 1";

            let conn = await this.#db.getConnection();
            const [rows] = await conn.execute(query, [this.id()]);
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

        } catch (err) {
            throw new customError(500, err.message)
        }

    }

    access(slug=null) {
        const Access = require('./User/Access');
        return new Access(this.#db, this, slug);
    }

    //@todo: move meta into its own class
    async meta(slug=null) {

        try {

            if ( this.#token_instance || typeof this.#token_instance === 'object') {

                if (slug === null) {
                    return this.#token_instance.meta;
                }

                if (slug in this.#token_instance.meta) {
                    return this.#token_instance.meta[slug]
                }

                return false;

            }

            const query = `SELECT *
                       FROM user_has_meta
                                LEFT JOIN user_meta ON user_has_meta.meta=user_meta.id
                       WHERE user_has_meta.user=?`;

            let conn = await this.#db.getConnection();
            const [rows] = await conn.execute(query, [this.id()]);
            conn.release();

            let meta = {};

            rows.forEach(function(row) {

                if(slug!==null && slug===row['slug']) {
                    return row['value'];
                }

                if (!meta.hasOwnProperty(row['slug'])) {
                    meta[row['slug']] = [];
                }

                if(slug===null) {
                    meta[row['slug']].push(row['value']);
                }

            });

            if (slug!==null) {
                return false;
            }

            return meta;

        } catch (err) {
            throw new customError(500, err.message)
        }

    }

    //@todo: move role into its own class
    async role(slug = null) {

        const query = `SELECT *
                       FROM user_has_role
                                LEFT JOIN user_role ON user_has_role.role=user_role.id
                       WHERE user_has_role.user=?`;

        let conn = await this.#db.getConnection();
        const [rows] = await conn.execute(query, [this.id()]);
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

        if (slug!==null) {
            return false;
        }

        return role;

    }

    fromToken(user) {

        if ( user === null || typeof user !== 'object') {
            throw new customError(500, 'Failed to parse user');
        }

        this.#token_instance = user
        this.#id = user.info.id

        return this;

    }

    getTokenInstance() {

        if ( this.#token_instance || typeof this.#token_instance === 'object') {
            return this.#token_instance
        }

        return false;

    }


    id() {
        if (!this.#id || isNaN(this.#id)) {
            throw new customError(500, 'Missing user id');
        }
        return parseInt(this.#id);
    }

    // post(post_id) {
    //     const Post = require('../WS/Post');
    //     return new Post(this.#db, this.id, post_id);
    // }


}

module.exports = User;