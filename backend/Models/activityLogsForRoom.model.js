const mongoose = require("mongoose")
const { ROOMLOGS } = require("../constants/constants")
const roomActivitySchema = mongoose.model(
  "roomActivitySchema",
  mongoose.Schema({
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    actions: {
      type: String,
      enum: Object.values(ROOMLOGS),
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    target_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    details: {
      type: String,
      default: "",
    },
  })
)

module.exports = roomActivitySchema
