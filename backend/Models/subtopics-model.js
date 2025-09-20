const mongoose = require("mongoose");
const subtopicSchema = new mongoose.model(
  "subtopics",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      topic_id: {
        type: mongoose.Type.Schema.ObjectId,
        ref: "topicSchema",
        required: true,
      },
      image: {
        type: String,
      },
      summary: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = subtopicSchema;
