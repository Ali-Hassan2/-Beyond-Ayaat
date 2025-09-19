const mongoose = require("mongoose")
const blogsSchema = new mongoose.model(
  "blogsSchema",
  mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        required: true,
      },
      title: {
        type: String,
        trim: true,
        required: true,
      },
      created_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
      topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topicSchema",
        required: true,
      },
      status:{
        type:string,
        enum:["draft","published"],
        default:"draft"
      },
      subtopic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subtopicSchema",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
)

module.exports = blogsSchema
