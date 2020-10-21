const Task =  require("../model/taskModel");
const internalErrorResponse =  require("../utils/internalErrorResponse");

const taskController = {};

taskController.newTask = async (req, res, next) => {
    const { title } = req.body;
    console.log("task",req.userData);
    const taskData =  await Task.find().sort({taskid:-1})
                if(taskData.length == 0){
                    seq = "TSK001"        
                }else{
                    let id = (Number(taskData[0].taskid.slice(3,7))+1).toString()
                    let targetLength = 4-id.length
                    let uid = id.padStart(targetLength, 0)
                    seq = "SLR"+uid
                }
                const new_task = new Task({
                    taskid: seq,
                    userid: req.userData.userid,
                    title
                });
                   await  new_task.save()
                    .then(result => res.status(201).json({message:'created a new Task',result}))
                    .catch(err => res.status(500).json(err));
};

taskController.Tasks =  async (req, res, next) => {
    console.log(req.userData.userid);
    Task.find({ userid: req.userData.userid })
        .select('columnOrder title  taskid')
        .exec()
        .then(tasks => {
            if (tasks.length === 0) {
                const firstTask = new Task({
                   taskid: 'TSK001',
                   userid:req.userData._id,
                   title:'',
                });
                return res.status(200).json({ message: 'Task has not yet created by this user' ,tasks})
            }
            return res.status(200).json({ message: 'Success', tasks })
        })
        .catch(error => internalErrorResponse(error, res));
};

taskController.getTask = async (req, res, next) => {
    console.log("get task")
    console.log("taskid=  ",req.params.taskId)
    Task.findOne({taskid: req.params.taskId })
        .exec()
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'task with given id was not found' });
            }
            return res.status(200).json({ details: task })
        })
        .catch(error => internalErrorResponse(error, res));
};



module.exports= taskController;