const mongoose = require("mongoose")
const userSchema = new mongoose.model(
  "user",
  mongoose.Schema(
    {
      first_name: {
        type: String,
        required: false,
      },
      last_name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
        unique: true,
      },
      password: {
        type: String,
        required: false,
        unique: true,
      },
    },
    { timestamps: true }
  )
)

module.exports = userSchema
