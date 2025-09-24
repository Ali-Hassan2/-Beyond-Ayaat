const mongoose = require("mongoose")
const commentsSchema = require("./comment-model")
const blogsSchema = new mongoose.model(
  "blogsSchema",
  new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
        ref: "topic",
        default: null,
      },
      status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
      },
      subtopic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subtopics",
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
      comments: {
        type: [commentsSchema],
        default: [],
      },
    },
    { timestamps: true }
  )
)

module.exports = blogsSchema
