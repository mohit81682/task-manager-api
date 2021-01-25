const mongoose = require('mongoose');
const Task = require('../src/models/task');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useCreateIndex: true,
    useUnifiedTopology: true
});

//promise chaining challenge

// Task.findByIdAndDelete('5fa44462ee22cc68964725e5').then((user)=> {
//     console.log(user);
//     return Task.countDocuments({completed: true});
// }).then((count) => {
//     console.log(count);
// }).catch((err) => {
//     console.log(err);
// })

//without promise chaining
Task.findByIdAndDelete('5fa44462ee22cc68964725e5').then((user)=> {
    console.log(user);
    Task.countDocuments({completed: false}).then((count) => {
        console.log(count);
    }).catch((e) =>{
        console.log(e);
    });
}).catch((err) => {
    console.log(err);
})