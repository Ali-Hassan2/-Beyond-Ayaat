const mongoose = require("mongoose");
const mediaSchema = new mongoose.model(
  "media",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      type: {
        type: String,
      },
      url: {
        type: String,
      },
      subtopic_id: {
        type: mongoose.Types.Schema.ObjectId,
        required: true,
      },
    },
    { timestamps: true }
  )
);
module.exports = mediaSchema;
