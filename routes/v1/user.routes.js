const  {Router} = require('express');
const userController = require('../../controllers/user.controller')

const router = Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.put('/:id', userController.update);
router.post('/', userController.create);
router.delete('/', userController.destroy);


module.exports = router;