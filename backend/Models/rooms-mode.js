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
        type: boolean,
        default: true,
      },
      request: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          default: [],
        },
      ],
      memeber: [
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
