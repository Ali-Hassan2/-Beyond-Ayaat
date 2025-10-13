const express = require("express")
const UserAnalytics = require("../Controllers/user-analytics/user-growth-over-time")
const ActiveVsInActive = require("../Controllers/user-analytics/active-inactive-pie-data")
const WEEKLYSIGNUPS = require("../Controllers/user-analytics/weekly-signups")
const TopUsersByEngagement = require("../Controllers/user-analytics/get-engagement")
const { adminmiddle } = require("../Middlewares/adminmiddleware")
const WEEKSIGNUPS = new WEEKLYSIGNUPS()
const TOPUSERENGAGEMENT = new TopUsersByEngagement()

const router = express.Router()

router.get("/userprofile/growth", adminmiddle, UserAnalytics.growthOverTime)
router.get(
  "/userprofile/activeinactive",
  adminmiddle,
  ActiveVsInActive.getStatus
)
router.get(
  "/userprofile/getweeklysignups",
  adminmiddle,
  WEEKSIGNUPS.getWeeklySignUps
)
router.get(
  "/userprofile/getusersengagement",
  adminmiddle,
  TOPUSERENGAGEMENT.getTopUsers
)

module.exports = router
