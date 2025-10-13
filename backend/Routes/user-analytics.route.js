const express = require("express")
const UserAnalytics = require("../Controllers/user-analytics/user-growth-over-time")
const ActiveVsInActive = require("../Controllers/user-analytics/active-inactive-pie-data")
const { adminmiddle } = require("../Middlewares/adminmiddleware")

const router = express.Router()

router.get("/userprofile/growth", adminmiddle, UserAnalytics.growthOverTime)
router.get(
  "/userprofile/activeinactive",
  adminmiddle,
  ActiveVsInActive.getStatus
)

module.exports = router
