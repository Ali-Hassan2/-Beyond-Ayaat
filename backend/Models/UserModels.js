const mongoose = require('mongoose');
const userSchema = new mongoose.Model('user',new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerfied:{
        type:Boolean,
        default:false
    }
}))

module.exports = userSchema