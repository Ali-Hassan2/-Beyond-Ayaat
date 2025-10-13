const express = require("express")
const UserAnalytics = require("../Controllers/user-analytics/user-growth-over-time")
const { adminmiddle } = require("../Middlewares/adminmiddleware")
const router = express.Router()

router.get("/userprofile/growth", adminmiddle, UserAnalytics.growthOverTime)

module.exports = router
