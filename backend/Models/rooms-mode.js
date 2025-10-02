const mongoose = require("mongoose")

const roomSchema = new mongoose.model(
  "roomSchema",
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
      avatar: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      isPublic: {
        type: Boolean,
        default: true,
      },
      requests: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          default: [],
        },
      ],
      member: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          default: [],
        },
      ],
    },
    { timestamps: true }
  )
)

module.exports = { roomSchema }
