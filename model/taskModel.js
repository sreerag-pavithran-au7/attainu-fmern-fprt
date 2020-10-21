const mongoose = require( "mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskid:{
        type:String,
         required:true
        },
    userid:{
        type:String,
         required:true
        },
    title:{
        type:String,
        required:true
        },
    date:{
        type:Date, 
        default:Date.now()
    },
});

const Task = mongoose.model('tasks',taskSchema);

module.exports= Task;

