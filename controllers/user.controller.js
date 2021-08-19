const {request, response} = require('express');

class UserController {

    index = (req = request, res = response)=> {        
        res.json({
            'msg': 'Index - controlador'
        })
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