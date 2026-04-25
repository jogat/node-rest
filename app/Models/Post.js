const BaseModel = require('./BaseModel');

class Post extends BaseModel {
    static get tableName() {
        return 'post';
    }
}

module.exports = Post;
