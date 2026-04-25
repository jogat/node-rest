const  {Router} = require('express');
const middleware = require('../../http/middleware')
const sessionController = require('../../http/controllers/Session.controller')
const asyncHandler = require('../../http/asyncHandler');

const router = Router();

router.post('/login', asyncHandler(sessionController.login));
router.get('/data', middleware.auth, asyncHandler(sessionController.data));


module.exports = router;
