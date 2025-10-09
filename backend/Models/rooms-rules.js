const mongoose = require("mongoose")

const roomrules = mongoose.model(
  "roomrules",
  new mongoose.Schema(
    {
      rules: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
)

module.exports = roomrules
