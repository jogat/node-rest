const fs = require('fs')

class Storage {

    #localPath = './storage/app/public/'

    constructor() {

    }

    async put(path= '', contents, callback) {

        path = `${this.#localPath}${path}`;

        fs.writeFile(path, contents, function (err,data) {
            if (err) {
                throw new Error(err.message)
            }
            if (callback && typeof callback === 'function') {
                callback(data)
            }
        });

    }
    delete() {}
    allDirectories() {}
    allFiles() {}
    copy() {}
    createDirectory() {}
    deleteDirectory() {}
    disc() {}
    exist() {}
    async get(path) {

        try {

            if (!path || typeof path !== 'string') {
                throw new Error('undefined path')
            }

            return fs.readFileSync(path);
        } catch (err) {
            throw new Error(err.message)
        }

    }
    move() {}

}

module.exports = Storage;