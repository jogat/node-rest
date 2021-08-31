const customError = require('../../../helper/customError')
const Database = require('../../../db')
const {_knext} = require("../../../helper/common");


class PostType {

    #id;
    #db;

    constructor(database = Database, type=null) {
        this.#db = database;
        this.#id = type;

    }

    async get() {

        try {

            await this.#check()

            let db = await _knext(await this.#db.getConnection());

            let query = db.from('post_type');

            if (this.#id !== null) {
                query.where('id', '=', this.id());
            }

            return await query.select('*')

        } catch (err) {
            throw new customError(err.code || 500, err.message)
        }

    }

    async #check () {


        try {
            if (this.#id !== null) {

                console.log(this.#id)

                let db = await _knext(await this.#db.getConnection());

                if (!isNaN(this.#id)) {
                    this.#id = parseInt(this.#id);
                    return;
                }

                let post_type = await  db('cms').table('post_type')
                    .where('slug', this.#id)
                    .first('id')

                if (post_type) {
                    this.#id = parseInt(post_type.id);
                    return
                }

                throw new customError(500, 'Failed to assign post type to Post Type.');
            }
        } catch (err) {
            throw new customError(err.code || 500, err.message)
        }

    }

    id() {
        if (!this.#id || isNaN(this.#id)) {
            throw new customError(500, 'Missing post type id');
        }
        return parseInt(this.#id);
    }



}

module.exports = PostType;