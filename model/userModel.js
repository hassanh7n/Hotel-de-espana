const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide your name"],
        maxlength : [50, "Name cannot have more than 50 characters"]
    },
    email : {
        type : String,
        required : [true, "Please provide email address"],
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : "Plaese provide valid email"
        }
    },
    password : {
        type : String,
        required : [true, "Please provide password"],
        minlength : [6, "Password is too weak"]
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    verificationToken : {
        type : String
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    verified : Date,
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date,
    },
})



UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})


UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcryptjs.compare(candidatePassword, this.password);
    return isMatch
}



module.exports = mongoose.model('User', UserSchema);