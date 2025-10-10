const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
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

const Message = mongoose.model("messagesSchema", messageSchema)
module.exports = Message
