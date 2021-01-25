const jwt = require('jsonwebtoken');
const User = require('../models/user');

//auth middleware validate the request with token
const auth = async (req, res, next) => {
    try{
        console.log('auth middleware');
        const token = req.header('Authorization').replace('Bearer ','');
        //validate token
        const payload = jwt.verify(token, process.env.JWT_TOKEN_KEY);

        //find user by user-id and token
        const user = await User.findOne({'_id': payload._id, 'tokens.token': token})
        // user is not valid
        if(!user){
            throw new Error();
        }
        //put user in request object
        req.token = token;
        req.user = user;
        next();
    } catch(e){
        res.status(401).send({'error': 'Authentication failed'});
    }
}

module.exports = auth