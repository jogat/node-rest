const BaseModel = require('./BaseModel');

class Access extends BaseModel {
    static get tableName() {
        return 'access';
    }
}

module.exports = Access;
