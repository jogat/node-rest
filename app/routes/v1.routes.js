const  {Router} = require('express');

const router = Router();

router.use('/user', require('./v1/user.routes'));

module.exports = router;