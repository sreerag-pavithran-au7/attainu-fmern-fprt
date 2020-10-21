var express = require('express');
var router = express.Router();
const taskController  = require('../controller/taskController');
const checkAuth = require('../middleware/check-auth');

/* POST TAsk  */
router.post('/addtask',checkAuth,taskController.newTask);

router.get('/tasks', checkAuth,taskController.Tasks);

router.get('/task/:taskId', checkAuth,taskController.getTask);

module.exports = router;