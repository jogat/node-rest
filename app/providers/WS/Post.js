const customError = require('../../helper/customError')
const {paginate, _knext} = require('../../helper/common');
const Database = require('../../db');
const User = require('../WS/User')
const {Storage} = require('../../helper');

class Post {

    #id;
    #db;
    #qb;

    constructor(database = Database, postId) {
        this.#id = postId;
        this.#db = database;

    }

    async userFeed_old(user= User, page=1) {

        try {

            page = isNaN(page) ? 1 : parseInt(page);

            //@todo: move meta into its own class
            let {audiences, categories} = await user.meta();

            let queryParameters = [];

            let columns = [
                'post.id as id',
                'MAX(post.slug) as slug',
                'MAX(post.title) as title',
                'MAX(post.description) as description',
                'MAX(post.thumbnail) as thumbnail',
                'MAX(post.resource) as resource',
                'MAX(post.body) as body',
                'MAX(post.json_data) as json_data',
                'MAX(post.last_published_date) as last_published_date',
                'MAX(post.status) as status',
                'MAX(post.type) as type',
                'MAX(post.author) as author',
                "CONCAT(MAX(user.first_name), ' ', MAX(user.last_name)) as author_name",
                'MAX(post_status.title) as status_title',
                'MAX(post_type.title) as type_title',
                'COUNT(post_comment.id) as comment_count'
            ];



            let query = `
                    SELECT
                        ${columns.join(',')}
                    FROM post                    
                    JOIN user
                        ON post.author = user.id
                    JOIN post_status
                        ON post_status.id = post.status
                    JOIN post_type
                         ON post_type.id = post.type
                    LEFT JOIN post_has_audience
                              ON post.id = post_has_audience.post
                    LEFT JOIN audience
                              ON post_has_audience.audience = audience.id
                    LEFT JOIN post_has_category
                              ON post.id = post_has_category.post
                    LEFT JOIN post_category
                              ON post_has_category.category = post_category.id
                    LEFT JOIN post_comment
                        ON post.id = post_comment.post
                    WHERE post.status = 1 `;

            // if (audiences && audiences.length) {
            //     query += 'AND post_has_audience.audience in (' + audiences.map(()=> '?')  + ') ';
            //     queryParameters = [...queryParameters, ...audiences]
            //
            // }
            //
            // if (categories && categories.length) {
            //     query += 'AND post_has_category.category in (' + categories.map(()=> '?')  + ') ';
            //     queryParameters = [...queryParameters, ...categories]
            // }

            query += 'GROUP BY post.id'

            let conn = await this.#db.getConnection();
            let results = await paginate(conn, query, queryParameters, page);

            conn.release();

            results.items = results.items.map((row)=> {

                return Post.#formatPost(row);

            });

            return results;

        } catch (err) {
            throw new customError(500,err.message)
        }

    }
    async userFeed(user= User, page=1) {

        try {

            let db = await _knext(await this.#db.getConnection());

            page = isNaN(page) ? 1 : parseInt(page);

            //@todo: move meta into its own class
            let {audiences, categories} = await user.meta();

            let columns = [
                'post.id as id',
                'MAX(post.slug) as slug',
                'MAX(post.title) as title',
                'MAX(post.description) as description',
                'MAX(post.thumbnail) as thumbnail',
                'MAX(post.resource) as resource',
                'MAX(post.body) as body',
                'MAX(post.json_data) as json_data',
                'MAX(post.last_published_date) as last_published_date',
                'MAX(post.status) as status',
                'MAX(post.type) as type',
                'MAX(post.author) as author',
                "CONCAT(MAX(user.first_name), ' ', MAX(user.last_name)) as author_name",
                'MAX(post_status.title) as status_title',
                'MAX(post_type.title) as type_title',
                'COUNT(post_comment.id) as comment_count'
            ];


            let q = db.from('post')
                .join('user', 'post.author','user.id')
                .join('post_status', 'post_status.id','post.status')
                .join('post_type', 'post_type.id','post.type')
                .leftJoin('post_has_audience','post.id','post_has_audience.post')
                .leftJoin('audience','post_has_audience.audience','audience.id')
                .leftJoin('post_has_category','post.id','post_has_category.post')
                .leftJoin('post_category','post_has_category.category','post_category.id')
                .leftJoin('post_comment','post.id','post_comment.post')
                .where('post.status',1)
                .groupBy('post.id');

            columns.forEach((column)=> {
                q.select(db.raw(column))
            });

            if (audiences && audiences.length) {
                q.whereIn('post_has_audience.audience', audiences);
            }

            if (categories && categories.length) {
                q.whereIn('post_has_category.category', categories);
            }

            let results = await q.paginate({ perPage: 10, currentPage: page, isLengthAware: true });

            results.data = results.data.map((row)=> {
                return Post.#formatPost(row);
            });

            return results;

        } catch (err) {
            throw new customError(500,err.message)
        }

    }

    async getByUser(user= User) {

        try {

            let {audiences, categories} = await user.meta();

            let columns = [
                'post.id',
                'MAX(post.slug) as slug',
                'MAX(post.title) as title',
                'MAX(post.description) as description',
                'MAX(post.thumbnail) as thumbnail',
                'MAX(post.resource) as resource',
                'MAX(post.body) as body',
                'MAX(post.json_data) as json_data',
                'MAX(post.last_published_date) as last_published_date',
                'MAX(post.status) as status',
                'MAX(post.type) as type',
                'MAX(post.author) as author',
                "CONCAT(MAX(user.first_name), ' ', MAX(user.last_name)) as author_name",
                'MAX(post_status.title) as status_title',
                'MAX(post_type.title) as type_title',
                'COUNT(post_comment.id) as comment_count'
            ];

            let query = `
                    SELECT
                        ${columns.join(',')}
                    FROM post                    
                    JOIN user
                        ON post.author = user.id
                    JOIN post_status
                        ON post_status.id = post.status
                    JOIN post_type
                         ON post_type.id = post.type
                    LEFT JOIN post_has_audience
                              ON post.id = post_has_audience.post
                    LEFT JOIN audience
                              ON post_has_audience.audience = audience.id
                    LEFT JOIN post_has_category
                              ON post.id = post_has_category.post
                    LEFT JOIN post_category
                              ON post_has_category.category = post_category.id
                    LEFT JOIN post_comment
                        ON post.id = post_comment.post
                    WHERE post.status = 1 
                    AND post.id = ? `;

            let queryParameters = [this.id()];

            if (audiences && audiences.length) {
                query += 'AND post_has_audience.audience in (' + audiences.map(()=> '?')  + ') ';
                queryParameters = [...queryParameters, ...audiences]
            }

            if (categories && categories.length) {
                query += 'AND post_has_category.category in (' + categories.map(()=> '?')  + ') ';
                queryParameters = [...queryParameters, ...categories]
            }

            query += 'GROUP BY post.id LIMIT 1'

            let conn = await this.#db.getConnection();
            let [rows] = await this.#db.execute(query, queryParameters);
            conn.release();

            return rows.length ?  rows.map((row)=> {
                return Post.#formatPost(row);
            })[0] : {};

        } catch (err) {
            throw new customError(500,err.message)
        }


    }

    async addByUser(user = User, post = {}) {

        try {

            if (typeof post !== 'object' || !Object.entries(post).length) {
                throw new customError(400,"Invalid post")
            }

            if (!'type' in post || post.type === undefined) { throw new customError(400,"Missing post type") }
            if (!'title' in post || post.title === undefined) { throw new customError(400,"Missing post title") }
            if (!'description' in post || post.description === undefined) { throw new customError(400,"Missing post description") }

            let userAccess = user.access();

            if (!userAccess.has(userAccess.WRITE_OWN_POSTS)) {
                throw new customError(403,"Invalid permission")
            }

            let postTypes = await this.type().get();

            if (postTypes.filter(t => t.id === post.type).length === 0) {
                throw new customError(400,"Invalid post type")
            }

            let db = await _knext(await this.#db.getConnection());

            let slug = post.title.replace(/[^a-z0-9]/g, post.title.toLowerCase().trim().replace(/(<([^>]+)>)/gi, ""));
            let count = await db.table('post').where('slug', 'like', `${slug}%`).count({count: '*'}).first();

            if (count) {
                slug += `-${count.count}`;
            }

            this.#id = await db.table('post').insert({
                'type': post.type,
                'slug': slug,
                'author': user.id(),
                'title': post.title,
                'description': post.description,
                 'status': 1, //@todo: add constant here
                 'thumbnail': null,
                'created_at': db.raw('NOW()'),
                'updated_at': db.raw('NOW()'),
            }).returning('id');

            await this.setThumbnail(post.thumbnail);

            return this;

        } catch (err) {
            let errorCode = isNaN(err.code) ? 500 : err.code || 500
            throw new customError(errorCode ,err.message )

        }

    }

    async setThumbnail(image) {

        if (!image) {
            return;
        }

        try {

            const storage = new Storage();
            let filename = image.name;
            await storage.put(filename, await storage.get(image.tempFilePath));

            let db = await _knext(await this.#db.getConnection());
            await db.table('post')
                .where('id', this.id())
                .update({
                    thumbnail: filename
                })


        } catch (err) {
            let errorCode = isNaN(err.code) ? 500 : err.code || 500
            throw new customError(errorCode ,err.message )
        }

    }


    type(type) {
        const Type = require('./Post/Type');
        return new Type(this.#db, type);
    }

    id() {
        if (!this.#id || isNaN(this.#id)) {
            throw new customError(500, 'Missing post id');
        }
        return parseInt(this.#id);
    }

    static #formatPost(post={}) {

        return {
            'id': post.id,
            'slug': post.slug,
            'title': post.title,
            'description': post.description,
            'thumbnail': post.thumbnail,
            'resource': post.resource,
            'body': post.body,
            'json_data': post.json_data,
            'last_published_date': post.last_published_date,
            'comment_count': post.comment_count,
            'status': {
                'id': post.status,
                'title':post.status_title,
            },
            'type': {
                'id': post.type,
                'title': post.type_title,
            },
            'author': {
                'id': post.author,
                'name': post.author_name
            },
        }

    }


}

module.exports = Post;