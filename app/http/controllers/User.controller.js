const {request, response} = require('express');
const WS = require('../../providers/WS');

class UserController {

    async show (req = request, res = response) {
        const id = parseInt(req.params.id); 
        const params = req.query;
        res.json({
            'msg': 'UserController.show',
            'id': id,
            params,
            
        })
    }

    async update (req = request, res = response) {
        const id = parseInt(req.params.id);     
        res.json({
            'msg': 'UserController.update',
            'id': id
        })
    }

}


module.exports = new UserController();