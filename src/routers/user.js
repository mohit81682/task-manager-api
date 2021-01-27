const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const emailType = require('../emails/account');

//create user
router.post('/users', async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        emailType.sendWelcomeEmail(user.email, user.name);
        //create token
        const token = await user.generateWebToken();

        res.status(201).send({user, token});
    } catch(e){
        res.status(400).send(e.message);
    }
})

//fetch all users
router.get('/users', async (req,res) => {
	try{
	  const users = await User.find({});
	  res.status(201).send(users);
	} catch(error){
		res.status(500).send(error);
	}
})

//user login
router.post('/users/login', async (req,res) => {
	try{
        //const user = await User.findByCredentials(req.body.email, req.body.password);
        const user = await User.findOne({'email':req.body.email});
        if(!user){
            throw new Error('Invalid credentials.');
        }
        const token = await user.generateWebToken();
        res.status(201).send({user: user, token});
	} catch(e){
		res.status(500).send(e.message);
	}
})

//user logout
router.post('/user/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
         });

         req.user.save();
         res.status(200).send('User logout successfully');
    } catch(e){
        res.status(500).send('Error in logout');
    }
})

//user all sessions logout
router.post('/user/logout/all', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        req.user.save();
        res.status(200).send('User gets logged out from all devices');
    } catch (e){
        res.status(500).send('Error in logout');
    }
})

// read profile
router.get('/users/me', auth, async (req,res) => {
    try{
        res.send(req.user);
    } catch(e){
        res.status(502).send(e);
    }
})

//read single user
router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id;
    const user = await User.findById(_id);
    try{
        if(!user){
            return res.status(404).send(user);
        }
        // user-task relation
        await user.populate('tasks').execPopulate();
        console.log(user.tasks);
        res.status(200).send(user);
    } catch(e){
        res.status(404).send(e);
    }
})

//update profile
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        res.status(404).send({'error':'invalid update!'});
    }
    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save();
        res.status(200).send(req.user);
    }catch(e){
        res.status(404).send(e);
    }
})

//update user
router.patch('/users/:id',async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        res.status(404).send({'error':'invalid update!'});
    }
    try{
        const user = await User.findById(req.params.id);
        if(!user){
           return res.status(404).send('user not found');
        }
        console.log(user);
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        console.log(user);
        await user.save();

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true});
        if(!user){
            return res.status(404).send();
        }
        res.status(200).send(user);
    }catch(e){
        res.status(404).send(e);
    }
})

//delete profile
router.delete('/users/me',auth,async (req,res) => {
    try{
        req.user.remove();
        emailType.sendCancellationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    } catch(e){
        res.status(404).send(e);
    }
})

//delete a user
router.delete('/users/:id',async (req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send('User not found !');
        }
        res.status(200).send(user);
    } catch(e){
        res.status(404).send(e);
    }
})

const upload = multer({
    //dest: '../avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        console.log(file.originalname);
        //check if file type is pdf
        if(!file.originalname.endsWith('.pdf')){
            //cb(new Error('This file type is not valid mohit'));
        }
        if(!file.originalname.match(/\.(jpg|pdf)$/)){
            cb(new Error('This file type is not pdf or jpg'));
        }
        cb(undefined, file.originalname);
    }
});

const sharp = require('sharp');

//save profile picture
router.post('/user/me/avatar', auth, upload.single('avtar'),async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer; //req.file.buffer;
    await req.user.save();
    res.send();
},(error,req,res,next) => {
    res.status(500).send({'error': error.message});
});

//delete user profile
router.delete('/user/me/avatar', auth, upload.single('avtar'),async (req,res) => {
    req.user.avatar = null;
    await req.user.save();
    res.send();
},(error,req,res,next) => {
    res.status(500).send({'error': error.message});
});

//access user profile picture
router.get('/users/:id/avatar',async (req,res) => {
    const user = await User.findById(req.params.id);
    try{
        if(!user || !user.avatar){
            throw new Error('user/image not found');
        }
        res.set('Content-Type','image/jpg');
        res.status(201).send(user.avatar);
    } catch(e){
        res.status(500).send(e);
    }
});

module.exports = router