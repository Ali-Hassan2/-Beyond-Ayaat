const mongoose = require("mongoose")

const roomruleSchema = mongoose.model(
  "roomrulesSchema",
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

module.exports = roomruleSchema
