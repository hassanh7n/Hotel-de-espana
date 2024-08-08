const User = require('../model/userModel');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');0


const getAllUser = async(req, res) => {

    const user = await User.find({});


    res.status(StatusCodes.OK).json({
        user
    })
}


const singleUser = async(req, res) => {
    const {id : userId} = req.params;

    const user = await User.findOne({_id : userId});
    if(!user){
        throw new CustomError.BadRequestError(`No user with this id : ${id}`)
    }

    res.status(StatusCodes.OK).json({
        user
    })
}


const showMe = async(req, res) => {
    res.status(StatusCodes.OK).json({
         user : req.user
    })
}



const forgotPassword = async(req, res) => {
    const {id : userId} = req.params;
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Please provide both values")
    }
    const user = await User.findOne({_id : userId});
    if(!user){
        throw new CustomError.BadRequestError(`No user wirth this id : ${userId}`)
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect){
        throw new CustomError.BadRequestError("Password does not match!")
    }

    user.password = newPassword
    await user.save();
    res.status(StatusCodes.OK).json({
        msg : "Password updated successfuly"
    })
}

const updateUser = async(req, res) => {
    const {name, email} = req.body;
    const {id : userId} = req.params;

    if(!name || !email){
        throw new CustomError.BadRequestError("Please provide both values")
    }

    const user = await User.findOne({_id : userId});

    if(!user){
        throw new CustomError.BadRequestError(`No user wirth this id : ${userId}`)
    }

    user.email = email;
    user.name = name;
    await user.save();
    res.status(StatusCodes.OK).json({
        msg : "User Updated successfuly!"
    })
}


module.exports = {
    getAllUser,
    singleUser,
    showMe,
    forgotPassword,
    updateUser
}