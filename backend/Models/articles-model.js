const mongoose = require("mongoose");
const articleSchema = new mongoose.model(
  "articleSchema",
  mongoose.Schema(
    {
      subtiopic_id: {
        type: mongoose.Types.Schema.ObjectId,
        ref: "subtopicSchema",
        required: true,
      },
      user_id: {
        type: mongoose.Types.Schema.ObjectId,
        ref: "userSchema",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
      },
      science_refs: {
        type: string,
      },
      tags: {
        type: String,
      },
    },
    { timestamps: true }
  )
);
module.exports = articleSchema;
