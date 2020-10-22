const express =  require('express');
const checkAuth =  require("../middleware/check-auth");
const Board =  require("../models/Board");
const internalErrorResponse =  require("../utils/internalErrorResponse");

const boardRouter =  express.Router();
boardRouter.post('/', checkAuth, (req, res, next) => {
    const { title } = req.body;
    console.log(req.userData);
    Board.find()
        .exec()
        .then(board => {
            const newBoard = new Board({
                user: req.userData._id,
                title,
                columnOrder: []
            });
            newBoard.save()
                .then(result => res.status(201).json({message:'created a new board',result}))
                .catch(err => res.status(500).json(err));
        })
        .catch(error => internalErrorResponse(error, res))
});
// Reorder columns  in a  board
boardRouter.patch('/', checkAuth, (req, res) => {
    const { boardId, newColumnOrder } = req.body;
    if(boardId && newColumnOrder)
    {
   console.log(boardId,newColumnOrder);
       Board.findOneAndUpdate({_id:boardId}, { columnOrder: newColumnOrder })
                    .exec()
                    .then((board) => { 
                        const updatedColumnOrder = board.columnOrder;
                        console.log(updatedColumnOrder);
                        res.status(200).json({ message: 'Reorder success', updatedColumnOrder })
                    })
                    .catch(error => internalErrorResponse(error, res))
       }
       else {
           return res.status(400).json({message:'required parameters are missing'});
       }


});
// Get a board with id

boardRouter.get('/board/:boardId', checkAuth, (req, res, next) => {
    console.log("get board")
    Board.findOne({ _id: req.params.boardId })
        .exec()
        .then(board => {
            if (!board) {
                return res.status(404).json({ message: 'Board with given id was not found' });
            }
            return res.status(200).json({ details: board })
        })
        .catch(error => internalErrorResponse(error, res));
});
//  Get all boards of the user

boardRouter.get('/all', checkAuth, (req, res, next) => {
    console.log("herreee ===",req.userData._id);
    Board.find({ user: req.userData._id })
        .select('columnOrder title _id')
        .exec()
        .then(boards => {
            if (boards.length === 0) {
                const firstBoard = new Board({
                   user:req.userData._id,
                   title:'',
                   columnOrder:[]
                });
                return res.status(200).json({ message: 'Board has not yet created by this user' ,boards})
            }
            return res.status(200).json({ message: 'Success', boards })
        })
        .catch(error => internalErrorResponse(error, res));
});


module.exports= boardRouter;