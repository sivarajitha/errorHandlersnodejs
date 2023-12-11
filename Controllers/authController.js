const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const CustomError=require('./../Utils/CustomError');
const jwt=require('jsonwebtoken');
const util=require('util')
const signToken= id => { 
    return jwt.sign({id},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);
   const token=signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});
//already signedup  and only users to login
exports.login=async (req,res,next)=>{
const email=req.body.email;
const password=req.body.password;
// const{email,password}=req.body;
if(!email || !password){
    const error=new CustomError('Please provide email Id and password for login',400);
    return next(error);
}
//check if user exists in the data base
const user=await User.findOne({email}).select('+password')
//  const isMatch=await user.comparePasswordInDb(password,user.password);
 //check if userexists and password matches
 if(!user || !(await user.comparePasswordInDb(password,user.password))){
    const error=new CustomError('Incorrect email or password',400);
     return next(error);
 }
//if both matches user and user password exists
 const token=signToken(user._id);
res.status(200).json({
    status:"success",
    token,
 
})
}
exports.protect=asyncErrorHandler(async (req,res,next)=>{
    //1.Read the token & check if it exist
    const testToken = req.headers.authorization
       let token;
    if(testToken && testToken.startsWith('bearer')){
      token= testToken.split(' ')[1];
      console.log(token);
    }
    if(!token){
        next(new CustomError('You are not logged in!',401))
    }
    //2.validate the token
   const decodedToken=await util.promisify( jwt.verify)(token,process.env.SECRET_STR);
   console.log(decodedToken);
    //3.if the user exists 
     const user = await User.findById(decodedToken.id)

     if(!user){
        const error=new CustomError('The user with given token not exists',401)
        next(error);
     }
    //4.if the user changed password after the token was issued
        user.isPasswordChanged(decodedToken.iat);
    //5.allow user to access route
    next()
})