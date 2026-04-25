const mysql = require('mysql2/promise');
const knex = require('knex');
const { Model } = require('objection');
const { attachPaginate } = require('knex-paginate');

attachPaginate();

let knexInstance;

function connectionConfig(configs) {
    return {
        host: process.env.MYSQL_HOST || configs.host,
        user: process.env.MYSQL_USER || configs.user,
        password: process.env.MYSQL_PASSWORD || configs.password,
        database: process.env.MYSQL_DATABASE || configs.database,
        debug: configs.debug
    };
}

module.exports.init = function (configs) {

    return mysql.createPool({
        ...connectionConfig(configs),
        connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || configs.connectionLimit,
    });
};

module.exports.knex = function (configs) {

    if (!knexInstance) {
        knexInstance = knex({
            client: 'mysql2',
            connection: connectionConfig(configs),
            pool: {
                min: 0,
                max: parseInt(process.env.MYSQL_CONNECTION_LIMIT || configs.connectionLimit || 10)
            }
        });

        Model.knex(knexInstance);
    }

    return knexInstance;
};
