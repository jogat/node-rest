const  {Router} = require('express');

const router = Router();

router.use('/session', require('./v1/session.routes'));
router.use('/user', require('./v1/user.routes'));
router.use('/post', require('./v1/post.routes'));

module.exports = router;