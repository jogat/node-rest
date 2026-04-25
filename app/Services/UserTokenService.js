const customError = require('../helper/customError');

class UserTokenService {
    fromToken(token) {
        if (token === null || typeof token !== 'object' || !token.info || !token.info.id) {
            throw new customError(500, 'Failed to parse user');
        }

        return {
            id: token.info.id,
            info: token.info,
            access: token.access || [],
            meta: token.meta || {},
            role: token.role || [],
            tenant: token.tenant,
            platform: token.platform,
        };
    }
}

module.exports = UserTokenService;
