const PostModel = require('../Models/Post');
const PostTypeModel = require('../Models/PostType');

class PostRepository {
    feedQuery(user) {
        const { audiences, categories } = user.meta || {};
        const db = PostModel.knex();

        const query = db.from('post')
            .join('user', 'post.author','user.id')
            .join('post_status', 'post_status.id','post.status')
            .join('post_type', 'post_type.id','post.type')
            .leftJoin('post_has_audience','post.id','post_has_audience.post')
            .leftJoin('audience','post_has_audience.audience','audience.id')
            .leftJoin('post_has_category','post.id','post_has_category.post')
            .leftJoin('post_category','post_has_category.category','post_category.id')
            .leftJoin('post_comment','post.id','post_comment.post')
            .where('post.status', 1)
            .groupBy('post.id')
            .select([
                'post.id as id',
                db.raw('MAX(post.slug) as slug'),
                db.raw('MAX(post.title) as title'),
                db.raw('MAX(post.description) as description'),
                db.raw('MAX(post.thumbnail) as thumbnail'),
                db.raw('MAX(post.resource) as resource'),
                db.raw('MAX(post.body) as body'),
                db.raw('MAX(post.json_data) as json_data'),
                db.raw('MAX(post.last_published_date) as last_published_date'),
                db.raw('MAX(post.status) as status'),
                db.raw('MAX(post.type) as type'),
                db.raw('MAX(post.author) as author'),
                db.raw("CONCAT(MAX(user.first_name), ' ', MAX(user.last_name)) as author_name"),
                db.raw('MAX(post_status.title) as status_title'),
                db.raw('MAX(post_type.title) as type_title'),
                db.raw('COUNT(post_comment.id) as comment_count'),
            ]);

        if (audiences && audiences.length) {
            query.whereIn('post_has_audience.audience', audiences);
        }

        if (categories && categories.length) {
            query.whereIn('post_has_category.category', categories);
        }

        return query;
    }

    async feed(user, page = 1) {
        page = isNaN(page) ? 1 : parseInt(page);
        const results = await this.feedQuery(user).paginate({
            perPage: 10,
            currentPage: page,
            isLengthAware: true
        });

        results.data = results.data.map(row => this.format(row));
        return results;
    }

    async findVisibleForUser(id, user) {
        const row = await this.feedQuery(user)
            .where('post.id', id)
            .first();

        return row ? this.format(row) : {};
    }

    async typeExists(type) {
        const postType = await PostTypeModel.query().findById(type);
        return !!postType;
    }

    async slugCount(slug) {
        const result = await PostModel.query()
            .where('slug', 'like', `${slug}%`)
            .count({ count: '*' })
            .first();

        return parseInt(result.count || 0);
    }

    async create(data) {
        const ids = await PostModel.query().insert(data);

        if (ids && ids.id) {
            return ids.id;
        }

        if (Array.isArray(ids)) {
            return ids[0];
        }

        return ids;
    }

    async updateThumbnail(id, filename) {
        return PostModel.query()
            .patch({ thumbnail: filename })
            .findById(id);
    }

    format(post={}) {
        return {
            id: post.id,
            slug: post.slug,
            title: post.title,
            description: post.description,
            thumbnail: post.thumbnail,
            resource: post.resource,
            body: post.body,
            json_data: post.json_data,
            last_published_date: post.last_published_date,
            comment_count: post.comment_count,
            featured: false,
            status: {
                id: post.status,
                title: post.status_title,
            },
            type: {
                id: post.type,
                title: post.type_title,
            },
            author: {
                id: post.author,
                name: post.author_name
            },
        };
    }
}

module.exports = PostRepository;
