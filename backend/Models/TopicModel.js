const mongoose = require('mongoose');

const topicSchema = new mongoose.Model('Topic', new mongoose.Schema({
    title:{
        type:String,
        unique:required
    },
    description:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
},{timestamps:true}))
module.exports = topicSchema