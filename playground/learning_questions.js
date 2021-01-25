//Q: how to create mongoose connection ?

const mongoose = require('mongoose')

const Modelschema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 6
    }
})

const xyzModel = mongoose.model('modelName',modelSchema)

//collection name will be modelname

// s or es will be added to the modelname colection while creating

// new database will be automatically created but visible after some create operation


//Q: How to create model methods ?

userSchema.methods.bio = function(){
    console.log(this.firstName + ' user has age '+this.age);
}

//Q: How to count users ?

User.find().countDocuments(); //OR
user.countDocuments();

//Q: how many types of metthods are in model?
// 3 types:  methods, .statics, virtual

