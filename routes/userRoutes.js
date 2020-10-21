var express = require('express');
var router = express.Router();
const userController  = require('../controller/userController');
const checkAuth = require('../middleware/check-auth');

/* POST Register  */
router.post('/register',userController.register);

/* POST LOGIN */
router.post('/login', userController.login);

/* DELETE User */
router.delete('/:userId',userController.deleteUsr);

router.get('/current',checkAuth,userController.current);

module.exports = router;

