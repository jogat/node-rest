const  {Router} = require('express');
const middlewares = require('../../http/middleware')
const userController = require('../../http/controllers/User.controller')

const router = Router();

router.use(middlewares.JWTVerification, (req, res, next)=> {
    router.get('/', userController.show);
    router.put('/', userController.update);
    next();
});



module.exports = router;