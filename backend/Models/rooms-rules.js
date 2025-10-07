const mongoose = require("mongoose")

const roomrules = new mongoose.model(
  "roomrules",
  mongoose.Schema(
    {
      room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomSchema",
        required: true,
      },
      rules: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  )
)

module.exports = roomrules
