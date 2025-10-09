const mongoose = require("mongoose")

const messagesSchema = mongoose.model(
  "messagesSchema",
  mongoose.Schema({
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
  })
)
module.exports = messagesSchema
