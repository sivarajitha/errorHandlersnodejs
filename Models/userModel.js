const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt');
//name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select:false//not to display the password in response
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate:{
            //confirmpassword and password validating
            validator:function(val){
                return val==this.password;
            },
            message:'password and confirm password doesnot match'
        }
    },
    passwordChangedAt:Date  
})
userSchema.pre('save',async function(next){
if(!this.isModified('password')) return next();
//encrypt the paassword before saving into database
this.password = await bcrypt.hash(this.password,12);
this.confirmPassword=undefined;
next();
})

userSchema.methods.comparePasswordInDb=async function(password,passwordDB){
   return await bcrypt.compare(password,passwordDB);

}
userSchema.methods.isPasswordChanged = async function (JWTTimeStamp){
        if(this.passwordChangeAt){
            console.log(this.passwordChangedAt,JWTTimeStamp);
        }
        return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;