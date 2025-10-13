const mongoose = require("mongoose")
const messageSchema = mongoose.model(
  "messageSchema",
  mongoose.Schema(
    {
      sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      room_id: { type: mongoose.Schema.Types.ObjectId, ref: "roomSchema" },
      content: { type: String, trim: true },
      image: {
        public_id: String,
        url: String,
      },
      reactions: [
        {
          reacter: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          emoji: String,
        },
      ],
      replies: [
        {
          replier: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          content: String,
        },
      ],
    },
    { timestamps: true }
  )
)
module.exports = messageSchema
