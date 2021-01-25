//npm i mongoose
// npm i validator

const mongoose = require('mongoose');
const validator = require('validator');

//useCreateIndex make sure when mongoos works with mongdb, our index are created so
//allow us to quickly access the data

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useCreateIndex: true
})

// const User = mongoose.model('User',{
//     name: {
//         type: String
//     },
//     age : {
//         type: Number
//     }
// })

// const me = new User({
//     name: 'Andrew',
//     age: 'dfdsfd'
// })

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error !', error)
// })

// const Task = mongoose.model('Task',{
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// });

// const taskOne = new Task({
//     description : 'Mongoose tutorial',
//     completed: false
// });

// taskOne.save().then(() =>{
//     console.log(taskOne);
// }).catch((error)=>{
//     console.log(error);
// })

//use Validation in defining field properties

// const Task = mongoose.model('Task',{
//     description:{
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 5
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     }
// })

// const taskTwo = new Task({
//     description: '1234',
//     completed: true
// });

// taskTwo.save().then(() => {
//     console.log(taskTwo);
// }).catch((error)=>{
//     console.log(error);
// })

const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email');
            }
        }
    },
    age:{
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error("age cannot be a negative number");
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        lowercase: true,
        validate(val){
            if(val.includes('password')){
                throw new Error('Password cannot be password');
            }
        }
    }
})

const userOne = new User({
    name: 'Mohit Kumar',
    email: 'MOHIT81682@gmail.com',
    age: 10,
    password: '      passw       '
});

userOne.save().then(() => {
    console.log(userOne);
}).catch((error) => {
    console.log(error);
})

//Rest API is used to access/manipulate resources throug a predefined set of operations
// In web token , first part reveal algo used, second part is payload and third is signature
