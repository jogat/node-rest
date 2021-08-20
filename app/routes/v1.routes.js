const  {Router} = require('express');

const router = Router();

router.use('/user', require('./v1/user.routes'));
router.use('/session', require('./v1/session.routes'));

module.exports = router;