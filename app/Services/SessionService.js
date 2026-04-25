const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customError = require('../helper/customError');
const UserRepository = require('../Repositories/UserRepository');

class SessionService {
    constructor(userRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async login(email, password, tenant, platform) {
        const user = await this.userRepository.findActiveByEmail(email);

        if (!user) {
            throw new customError(400, 'Not found user');
        }

        if (!this.hashMatchPassword(user.password, password)) {
            throw new customError(401, 'username or password is invalid');
        }

        const accessTokenExpiration = parseInt(process.env.ACCESS_TOKEN_EXPIRATION);
        const issued = new Date();
        const expires = new Date(issued.getTime() + (accessTokenExpiration * 1000));
        const userData = {
            info: await this.userRepository.info(user.id),
            access: await this.userRepository.access(user.id),
            meta: await this.userRepository.meta(user.id),
            role: await this.userRepository.roles(user.id),
            issued,
            expires
        };

        const token = jwt.sign({
            info: userData.info,
            access: userData.access,
            meta: userData.meta,
            role: userData.role,
            tenant,
            platform,
        }, process.env.JWT_KEY, { expiresIn: accessTokenExpiration });

        return {
            userData,
            accessToken: `Bearer ${token}`
        };
    }

    hashMatchPassword(passwordHash, password) {
        passwordHash = passwordHash.replace('$2y$', '$2a$');
        return bcrypt.compareSync(password, passwordHash);
    }
}

module.exports = SessionService;
