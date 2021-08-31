const  {Router} = require('express');
const middlewares = require('../../http/middleware')
const userPostController = require('../../http/controllers/Post.controller')

const router = Router();

router.use(middlewares.JWTVerification, (req, res, next)=> {
    router.get('/user-feed', userPostController.userFeed);
    router.get('/:id', userPostController.show);
    router.post('/', userPostController.add);
    next();
});


module.exports = router;