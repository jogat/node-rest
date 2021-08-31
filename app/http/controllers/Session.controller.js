const {request, response} = require('express');
const WS = require('../../providers/WS');

class SessionController {

    async login (req = request, res = response){
                
        try {

            const {email, password, tenant_token, platform} = req.body;

            if (!email || !email.length) { res.status(400).send('Missing email'); }
            if (!password || !password.length) { res.status(400).send('Missing password'); }

            let results = await WS.session().login(email, password, tenant_token, platform);

            res.json({
                'msg': 'index - controlador',
                "results": results
            })


        } catch(err) {
            res.status(err.code || 401).send(err.message || 'Invalid Login');
        }
        
    }

    async data (req = request, res = response){

        try {

            res.json(req._user);

        } catch(err) {
            res.status(err.code || 500).send(err.message);
        }

    }




}


module.exports = new SessionController();