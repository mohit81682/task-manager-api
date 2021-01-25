//npm i mongoose
// npm i validator

const mongoose = require('mongoose');

//useCreateIndex make sure when mongoos works with mongdb, our index are created so
//allow us to quickly access the data

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


//Rest API is used to access/manipulate resources throug a predefined set of operations