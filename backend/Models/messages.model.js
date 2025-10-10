const mongoose = require("mongoose")

const messagesSchema = mongoose.model(
  "messagesSchema",
  mongoose.Schema(
    {
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomSchema",
      },
      content: {
        type: String,
        trim: true,
      },
      image: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      reactions: [
        {
          reacter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          emoji: string,
        },
      ],
      replies: [
        {
          replier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          content: {
            type: String,
          },
        },
      ],
    },
    { timestamps: true }
  )
)
module.exports = messagesSchema
