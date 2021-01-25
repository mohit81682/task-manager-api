const mongoose = require('mongoose');
const User = require('../src/models/user');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//promise chaining
// User.findByIdAndUpdate('5fa441f21cd54467de197dc5',{name:'andrew',age:28}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age: 28});
// }).then( (userCount) => {
//     console.log(userCount);
//     return User.countDocuments({});
// }).then( (users) => {
//     console.log(users);
// }).catch((err) => {
//     console.log('Err',err);
// })

//promise chaining to async await

const updateDocumentsAndCount = async (id,name,age) => {
    const user = await User.findByIdAndUpdate(id,{name,age});
    const userCount = await User.countDocuments({});
    return userCount;
};

updateDocumentsAndCount('5fa441f21cd54467de197dc5','Andrew',30).then((result) => {
    console.log({result});
}).catch((err) => {
    console.log(err);
})
