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
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topic",
        default: null,
      },
      subtopicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subtopics",
        default: null,
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
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "messagesSchema",
          default: [],
        },
      ],
      room_rules: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roomrulesSchema",
        default: null,
      },
      pinnedMessages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "messageSchema",
          default: [],
        },
      ],
    },
    { timestamps: true }
  )
)

module.exports = { roomSchema }
