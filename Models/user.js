const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    email:{
        type: String,
    },
    mobile:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    aadhar:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVoted:{
        type: Boolean,
        default: false
    }
})



userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword
        next();
    } catch (error) {
        return next(error);
    }

})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch; 
    }
    catch(error){
        return error;
    }
}


const User = mongoose.model('user', userSchema);
module.exports = User;