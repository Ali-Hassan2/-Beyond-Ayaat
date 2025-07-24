const mongoose = require("mongoose");
const topicSchema = new mongoose.model(
  "topic",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
      },
    },
    { timestamps: true }
  )
);
module.exports = topicSchema;
