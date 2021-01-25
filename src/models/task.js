const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})
//Use Validation in defining field properties
const Task = mongoose.model('Task',taskSchema);

module.exports = Task