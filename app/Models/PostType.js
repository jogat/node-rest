const BaseModel = require('./BaseModel');

class PostType extends BaseModel {
    static get tableName() {
        return 'post_type';
    }
}

module.exports = PostType;
