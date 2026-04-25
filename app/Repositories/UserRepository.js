const UserModel = require('../Models/User');

class UserRepository {
    async findActiveByEmail(email) {
        return UserModel.query()
            .select('id', 'password')
            .where('status', '>', 0)
            .where('email', email)
            .first();
    }

    async info(id) {
        const user = await UserModel.query().findById(id);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: {
                first: user.first_name,
                last: user.last_name,
            },
            mod: user.updated_at,
            status: user.status,
        };
    }

    async meta(id) {
        const rows = await UserModel.knex()
            .from('user_has_meta')
            .leftJoin('user_meta', 'user_has_meta.meta', 'user_meta.id')
            .where('user_has_meta.user', id)
            .select('user_meta.slug', 'user_has_meta.value');

        return rows.reduce((meta, row) => {
            if (!meta[row.slug]) {
                meta[row.slug] = [];
            }

            meta[row.slug].push(row.value);
            return meta;
        }, {});
    }

    async roles(id) {
        const rows = await UserModel.knex()
            .from('user_has_role')
            .leftJoin('user_role', 'user_has_role.role', 'user_role.id')
            .where('user_has_role.user', id)
            .select('user_role.slug');

        return rows.map(row => row.slug);
    }

    async access(id) {
        const rows = await UserModel.knex()
            .from(function accessUnion() {
                this.select('access as id')
                    .from('user_has_role')
                    .leftJoin('user_role_has_access', 'user_has_role.role', 'user_role_has_access.role')
                    .where('user', id)
                    .union(function directAccess() {
                        this.select('access')
                            .from('user_has_access')
                            .where('user', id);
                    })
                    .as('results');
            })
            .leftJoin('access', 'access.id', 'results.id')
            .select('access.slug');

        return rows.reduce((access, row) => {
            if (row.slug && !access.includes(row.slug)) {
                access.push(row.slug);
            }

            return access;
        }, []);
    }
}

module.exports = UserRepository;
