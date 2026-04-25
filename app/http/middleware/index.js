const {request, response} = require('express');


const auth = function(req = request, res = response, next){

    if (!req.headers.authorization) {
        return res.status(403).send('Unauthorized')
    }

    const jwt = require('jsonwebtoken');
    let bearer = req.headers.authorization.split(' ');

    if (bearer.length !== 2 || bearer[0] !== 'Bearer' || !bearer[1]) {
        return res.status(403).send('Forbidden')
    }

    jwt.verify(bearer[1], process.env.JWT_KEY,(err, authData)=> {

        if (err) {
            return res.status(403).send('Forbidden')
        } else {
            req._user = authData
        }

        next();
    });
};

module.exports = {
    auth,
    JWTVerification: auth,

}
