const  {Router} = require('express');
const middleware = require('../../http/middleware')
const sessionController = require('../../http/controllers/Session.controller')

const router = Router();

router.post('/login', sessionController.login);
router.get('/data', middleware.JWTVerification, sessionController.data);


module.exports = router;