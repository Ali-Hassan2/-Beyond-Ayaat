const mongoose = require("mongoose")

const blogsSchema = new mongoose.model(
  "blogsSchema",
  new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        required: true,
      },
      title: {
        type: String,
        trim: true,
        default: "",
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topicSchema",
        default: null,
      },
      status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
      },
      subtopic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subtopicSchema",
        default: null,
      },
      content: {
        type: String,
        default: "",
        required: false,
      },
      image: {
        public_id: { type: String },
        url: { type: String },
      },
    },
    { timestamps: true }
  )
)

module.exports = blogsSchema
