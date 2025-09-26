const express = require("express")
const {
  customizeProfile,
  getUserProfile,
} = require("../Controllers/user-profile-controller")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.route("/customizeyourprofile").post(usermiddle, customizeProfile)
router.route("/getuserprofile").get(usermiddle, getUserProfile)

module.exports = router
