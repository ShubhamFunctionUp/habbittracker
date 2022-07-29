const User = require('../model/userSchema');
const catchAsync = require('express-async-handler')
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema')
const signToken = function(id){
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}


const createAndSendToken = function (user,statusCode,res) {
    const token = signToken(user._id)
    const cookieOptions = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 *60*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV ==='production') cookieOptions.secure = true

    res.cookie('jwt',token,cookieOptions)

    user.password = undefined
    res.status(statusCode).json({status:'Success',data:{user}})
}

exports.protect = catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            res.status(401).json({
                status:'fail',
                message:'Please sign up or log in'
            })
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized')
    }
    next()

})

exports.signup = async (req, res, next) => {
    const { email, password, name, isAdmin } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({
            status: 'fail',
            message: 'User with the same email already exists.'
        });
    } else {
        const user = await User.create({ name, email, password, isAdmin });

        createAndSendToken(user, 201, res);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        createAndSendToken(user, 200, res);
    } else {
        res.status(400).json({
            status: 'fail',
            data: 'Incorrect email/password.'
        });
    }
};