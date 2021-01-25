const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    email:{
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps:true
});


// not using this method for now
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('unable to login 1');
    }
    const isMatch = await bcrypt.compare('test@123', '$2a$08$xlqoh9okr74s9tgyty9x2ejp.6uoleb7xzzzrogms/ytfoafa80ve');
    if(!isMatch){
        throw new Error('unable to login 2');
    }
    return user;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function(){
    const user = this;
    const userProfile = user.toObject();

    delete userProfile.tokens;
    delete userProfile.password;
    delete userProfile.avatar;

    return userProfile;
}

//Generate and save web tokens
userSchema.methods.generateWebToken = async function(){
    const user = this;
    const token = await jwt.sign({'_id': user._id}, process.env.JWT_TOKEN_KEY);

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({ owner: user._id});
    next();
})

userSchema.methods.bio = async function(age, cb){
    console.log('dynamic method');
    console.log(this.name + ' user has age '+ age);
    return await this.model('User').find({age: 42}, cb);
    //return this.model('User').find({age: 42}, cb);
}

userSchema.statics.bios = function(age){
    console.log(this);
    console.log('static method '+ age);
    return this.find({age});
}

const User = mongoose.model('User',userSchema);

module.exports = User