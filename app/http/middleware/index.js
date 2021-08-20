const {request, response} = require('express');

module.exports = {

    JWTVerification: function(req = request, res = response, next){

        if (!req.headers.authorization) {
            return res.status(403).send('Forbidden')
        }

        const jwt = require('jsonwebtoken');
        let bearer = req.headers.authorization.split(' ');

        jwt.verify(bearer[1], process.env.JWT_KEY,(err, authData)=> {

            if (err) {
                return res.status(403).send('Forbidden')
            } else {
                console.log(authData);
                req.token = authData
            }

        });

        next();
    },

}