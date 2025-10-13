const mongoose = require("mongoose")
const { REQUEST_STATUS, ROOMROLES } = require("../constants/constants")

const roomSchema = new mongoose.model(
  "roomSchema",
  mongoose.Schema(
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
      admins: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          role: {
            type: String,
            enum: Object.values(ROOMROLES),
            default: ROOMROLES.ADMIN,
          },
        },
      ],
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
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          role: {
            type: String,
            enum: Object.values(ROOMROLES),
            default: ROOMROLES.MEMBER,
          },
        },
      ],
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "messageSchema",
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

module.exports = roomSchema
