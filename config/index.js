const configs = require(`./config.${process.env.NODE_ENV || "dev"}`);

module.exports.getDatabaseConfig = function (tenantId) {

    let databaseConfig = configs.database;

    if (tenantId) {
        databaseConfig.database = `_${tenantId}`;
    }

    console.log(databaseConfig);

    return databaseConfig;
}

module.exports.getServerConfig = function () {
    return configs.server;
}