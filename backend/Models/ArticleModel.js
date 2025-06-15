const mongoose = require('mongoose');
const articleSchema = new mongoose.Model('Article',new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:String,
    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Topic',
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    scienceRef:String,
    quranRef:String,
    conclusion:String,
},{timestamps:true}))

module.exports = articleSchema;