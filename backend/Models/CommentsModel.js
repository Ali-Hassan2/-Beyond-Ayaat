const mongoose = require('mongoose');
const commentsSchema = new mongoose.Model('comments',new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    article:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article',
        required:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true}))
module.exports = commentsSchema;