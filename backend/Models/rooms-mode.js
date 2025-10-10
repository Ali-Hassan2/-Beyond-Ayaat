const mongoose = require("mongoose")
const { REQUEST_STATUS } = require("../constants/constants")

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
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
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isPublic: { type: Boolean, default: true },
    requests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        status: {
          type: String,
          enum: Object.values(REQUEST_STATUS),
          default: REQUEST_STATUS.PENDING,
        },
        _id: false,
      },
    ],

    member: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
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
        ref: "messagesSchema",
        default: [],
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("roomSchema", roomSchema)
