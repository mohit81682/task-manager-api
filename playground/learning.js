/// How to connect to mongodb database ?

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error',
console.error.bind(console, 'connection error:'));

db.once('open', function(){
    console.log('mongoose connected');
})

const User = require('../src/models/user');


// useNewUrlParser // because current url parser is deprecated
// useUnifiedTopology // current server discovery and monitoring engine is deprecated
// collection.ensureIndex is deprecated. Use createIndexes instead

////////////////////////////////////////////////////////////////////////////////////

/// how to update existing document ?

// const result = User.findByIdAndUpdate('5fc1e23a40ffa72a552329cd',{
//     name: 'User 14',
//     age: 41
// });

// result.then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log('Error is '+ err);
// })

////////////////////////////////////////////////////////////////////////////////////

///how to CREATE a new user in node js/mongo db ?
// Ans:

const obj = {name: 'user18', age: 48, email:'user18test2@gmail.com', password:'123456'};
const user = new User(obj);
// const user = User.findOne({age:48}, function(err,res){
//     if(err)
//         console.log(err);
//     console.log(res);
//     res.bio(res.age, function(err, res){
//         console.log(res);
//     });
// });


//NOTE: methods work on single object i.e new User({}).save() or User.find()


//By using Promise

// user.save().then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

//By using callback

// user.save(function(err, result){
//     if(err){
//         console.log('follwoing errors');
//         console.log(err);
//     }
//     console.log(result);
//         //it return user instance so result = user
//     result.bio(function(err, res){
//         console.log(res);
//     });
// })

// how to get all users/tasks from collection ?

// const User = require('../src/models/user');
// User.find().then((users) => {
//     console.log(users);
// }).catch((err) => {
//     console.log(err)
// });


// find all users based on some equals condition

//const condition = {};

// find by using callback

// User.find({}, function(err, users){
//     if(err)
//         console.log(err);

//     console.log(users);
//     User.countDocuments().then((count) => {
//         console.log(count);
//     })

// });

// find by using promise
// const allUsers = User.find();
// allUsers.then((users) => {
//     console.log(users);
//     return User.find().countDocuments();
// }).then((countUsers) => {
//     console.log('count is '+ countUsers);
// }).catch((err) => {
//     console.log(err)
// });


//const users = user.bio(42);


// NOTE: even if cb is provided , we have choices of either get it by cb or promise
// NOTE: even if cb isnot provied, we can get result by using Promise only

//Q: how to create route using express

const express = require('express');
const app = express();

app.use(express.json());

app.post('/test-validation', (req, res) => {
    console.log(req.body);
    res.send('testing route');
})

app.listen('7000', function(err, res){
    console.log('server connected successfully');
})
