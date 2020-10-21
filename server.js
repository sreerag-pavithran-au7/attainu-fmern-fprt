const express = require('express');
const cors = require('cors');
const morgan =require('morgan');
const bodyParser = require('body-parser');
require('./config/db');
const app = express();
const PORT = process.env.PORT||4000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

app.use('/',userRouter);
app.use('/',taskRouter)

