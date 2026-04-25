const path = require('path');
const customError = require('../helper/customError');
const { Storage } = require('../helper');
const PostRepository = require('../Repositories/PostRepository');
const UserTokenService = require('./UserTokenService');

class PostService {
    constructor(
        postRepository = new PostRepository(),
        userTokenService = new UserTokenService()
    ) {
        this.postRepository = postRepository;
        this.userTokenService = userTokenService;
    }

    async userFeed(token, page) {
        const user = this.userTokenService.fromToken(token);
        return this.postRepository.feed(user, page);
    }

    async showForUser(id, token) {
        const user = this.userTokenService.fromToken(token);
        return this.postRepository.findVisibleForUser(id, user);
    }

    async addByUser(token, post) {
        const user = this.userTokenService.fromToken(token);

        if (!user.access.includes('write-own-posts')) {
            throw new customError(403, 'Invalid permission');
        }

        if (!await this.postRepository.typeExists(post.type)) {
            throw new customError(400, 'Invalid post type');
        }

        const slug = await this.uniqueSlug(post.title);
        const postId = await this.postRepository.create({
            type: post.type,
            slug,
            author: user.id,
            title: post.title,
            description: post.description,
            status: 1,
            thumbnail: null,
            created_at: new Date(),
            updated_at: new Date(),
        });

        if (post.thumbnail) {
            await this.setThumbnail(postId, post.thumbnail);
        }

        return { id: postId };
    }

    async uniqueSlug(title) {
        let slug = title
            .toLowerCase()
            .trim()
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!slug.length) {
            slug = 'post';
        }

        const count = await this.postRepository.slugCount(slug);

        if (count) {
            slug += `-${count}`;
        }

        return slug;
    }

    async setThumbnail(postId, image) {
        const storage = new Storage();
        const filename = this.safeFilename(image.name);
        await storage.put(filename, await storage.get(image.tempFilePath));
        await this.postRepository.updateThumbnail(postId, filename);
    }

    safeFilename(filename) {
        filename = path.basename(filename || '').replace(/[^a-zA-Z0-9._-]/g, '-');

        if (!filename.length || filename === '.' || filename === '..') {
            throw new customError(400, 'Invalid thumbnail filename');
        }

        return filename;
    }
}

module.exports = PostService;
