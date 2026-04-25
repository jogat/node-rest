const  {Router} = require('express');
const middlewares = require('../../http/middleware')
const userPostController = require('../../http/controllers/Post.controller')
const asyncHandler = require('../../http/asyncHandler');

const router = Router();

router.use(middlewares.auth);

router.get('/user-feed', asyncHandler(userPostController.userFeed));
router.get('/:id', asyncHandler(userPostController.show));
router.post('/', asyncHandler(userPostController.add));

module.exports = router;
