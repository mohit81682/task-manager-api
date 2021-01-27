const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const bcrypt = require('bcryptjs');

// app.use((req, res, next) => {
//     //console.log(req.method, req.path);
//     return res.status(503).send('Maintaince work is in progess.Try Later');
//     if(req.method === 'GET'){
//         res.send('GET Methods are disabled');
//     } else {
//         next();
//     }
// })

//to automatically parse data
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

// pet.toJSON = function(){
//     delete this.email;
//     console.log(this);
//     return this;
// }

app.listen(port,() => {
    console.log("sds",process.env.JWT_TOKEN_KEY);
    console.log('A REST API Web service || Server connected successfully on port ', port);
})
