const mongoose = require("mongoose");
require('dotenv').config()

mongoose
  .connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("ERROR : ", err.message);
  });