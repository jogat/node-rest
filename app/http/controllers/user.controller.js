const {request, response} = require('express');
const WS = require('../../models/ws');

class UserController {

    async index (req = request, res = response){  
                
        try {

            const {email, password} = req.body;

            let results = await WS.session().login(email, password);

            res.json({
                'msg': 'index - controlador',
                "results": results[0]
            })


        } catch(err) {
            res.status(401).send('Invalid Login.');
        }
        
    }

    create = (req = request, res = response)=> {  
        
        const {text} = req.body;
        res.json({
            'msg': 'create - controlador',
            "body": text
        })
    }

    show = (req = request, res = response)=> {   
        const id = parseInt(req.params.id); 
        const params = req.query;
        res.json({
            'msg': 'show - controlador',
            'id': id,
            params,
            
        })
    }

    update = (req = request, res = response)=> { 
        const id = parseInt(req.params.id);     
        res.json({
            'msg': 'update - controlador',
            'id': id
        })
    }

    destroy = (req = request, res = response)=> {        
        res.json({
            'msg': 'destroy - controlador'
        })
    }

}


module.exports = new UserController();