const mongoose = require("mongoose")
const { REPORTINGREASONS } = require("../constants/constants")

const reportSchema = new mongoose.model(
  "reportSchema",
  mongoose.Schema(
    {
      reported_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      reason: {
        type: String,
        enum: Object.values(REPORTINGREASONS),
        required: true,
      },
      target_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
    { timestamps: true }
  )
)

module.exports = { reportSchema }
