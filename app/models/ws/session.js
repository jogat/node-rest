class Session {

    constructor(database) {
        this.db = database;
    }

    async login(email, password, tenant) {

        try {

            const query = "SELECT * FROM `user`";

            let conn = await this.db.getConnection();
            let res = await conn.execute(query);
            conn.release();            
            return res;

        } catch(err) {
            throw err
        }


    }

}

module.exports = Session;