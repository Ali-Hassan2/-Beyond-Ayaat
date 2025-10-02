const mongoose = require("mongoose")
const {
  PROFESSIONS,
  SOCIALLINKS,
  USERSTATUS,
  ATRISKUSERS,
} = require("../constants/constants")
const { reportSchema } = require("./report-model")
const userprofileSchema = new mongoose.model(
  "userprofileSchema",
  mongoose.Schema(
    {
      bio: {
        type: String,
        required: false,
      },
      profession: {
        type: String,
        required: false,
        enum: Object.values(PROFESSIONS),
      },
      contactNumber: {
        type: String,
        require: false,
      },
      location: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: Object.values(USERSTATUS),
        required: false,
        default: USERSTATUS.ACTIVE,
      },
      education: {
        type: String,
        required: false,
      },
      atRiskUsers: {
        type: String,
        enum: Object.values(ATRISKUSERS),
        default: ATRISKUSERS.SAFE,
      },
      socialMediaLinks: {
        type: Map,
        of: String,
      },
    },
    { timestamps: true }
  )
)

module.exports = { userprofileSchema }
