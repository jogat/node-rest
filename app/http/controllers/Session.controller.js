const {request, response} = require('express');
const LoginRequest = require('../Requests/LoginRequest');
const SessionService = require('../../Services/SessionService');

class SessionController {

    constructor(sessionService = new SessionService()) {
        this.sessionService = sessionService;
        this.login = this.login.bind(this);
        this.data = this.data.bind(this);
    }

    async login (req = request, res = response){

        const {email, password, tenant_token, platform} = new LoginRequest(req).validate();
        let results = await this.sessionService.login(email, password, tenant_token, platform);

        res.json(results);
        
    }

    async data (req = request, res = response){

        res.json(req._user);

    }




}


module.exports = new SessionController();
