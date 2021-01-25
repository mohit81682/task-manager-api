const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')

//update a task
router.patch('/tasks/:id', auth, async (req,res) =>{
    const params = Object.keys(req.body);
    const allowedUpdates = ['completed','description'];
    const isValidOperation = params.every((key) => {
        return allowedUpdates.includes(key);
    })

    if(!isValidOperation){
        return res.status(400).send('invalid arguments !');
    }
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true});
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
          return res.status(404).send('task not found');
        }
        params.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();

        res.status(200).send(task);
    } catch(e){
        res.status(400).send(e);
    }

})

//create task
router.post('/tasks',auth, async (req,res) => {
    //req.body.owner = req.user._id;   alternate method by me
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    } catch(e){
        res.status(400).send(e);
    }
})

//read tasks
router.get('/tasks',auth, async (req,res) => {
    try{

        var match = '';
        const sortObj = {};
        //match data
        if(req.query.completed){
            match = {
                completed: req.query.completed
            }
        }

        //sorting
        if(req.query.sortBy){
            const splitValue = req.query.sortBy.split(':');
            if(splitValue[0] === "completed"){
                sortObj.completed = splitValue[1] === 'desc' ? -1:1;
            }
            console.log(sortObj);
        }


        //const tasks = await Task.find({}); old code
        //const tasks = await Task.find({owner:req.user._id});
        //res.status(201).send(tasks);
        //await req.user.populate('tasks').execPopulate();
        await req.user.populate({
            path : 'tasks',
            match: match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sortObj
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch(e){
        res.status(500).send(e);
    }
})

//read single task
router.get('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id;
    try{
        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id, 'owner': req.user._id});
        if(!task){
            throw new Error();
        }
        // task-user relation
        await task.populate('owner').execPopulate();
        console.log(task.owner);
        res.status(200).send(task);
    } catch(e){
        res.status(404).send('Task not found!');
    }
})

//delete a task
router.delete('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id;
    try{
        //const task = await Task.findByIdAndDelete(_id);
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send('Task not found for delete purpose!');
        }
        res.status(200).send(task);
    } catch(e){
        res.status(404).send(e);
    }
})

//delete task when deleting user DONE
//get dates also DONE
//get only completed task

module.exports = router