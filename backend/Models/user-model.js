const mongoose = require("mongoose");
const userSchema = new mongoose.model(
  "user",
  mongoose.Schema(
    {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        unique: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = userSchema;
