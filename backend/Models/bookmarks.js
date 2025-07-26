const mongoose = require("mongoose");
const bookmarksSchema = new mongoose.model(
  "bookmarks",
  mongoose.Schema(
    {
      user_id: {
        type: mongoose.Types.Schema.ObjectId,
        ref: "userSchema",
      },
      article_id: {
        type: mongoose.Types.Schema.ObjectId,
        ref: "articleSchema",
      },
    },
    { timestamps: true }
  )
);
module.exports = bookmarksSchema;
