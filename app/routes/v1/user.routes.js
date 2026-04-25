const  {Router} = require('express');
const middlewares = require('../../http/middleware')
const userController = require('../../http/controllers/User.controller')
const asyncHandler = require('../../http/asyncHandler');

const router = Router();

router.use(middlewares.auth);

router.get('/', asyncHandler(userController.show));
router.put('/', asyncHandler(userController.update));


module.exports = router;
