const express = require("express")
const {
  customizeProfile,
  getUserProfile,
  updateTheProfile,
} = require("../services/user-profile-controller")
const usermiddle = require("../interceptors/usermiddleware")
const router = express.Router()

router.route("/customizeyourprofile").post(usermiddle, customizeProfile)
router.route("/getuserprofile").get(usermiddle, getUserProfile)
router.route("/upgradeuserprofile/:id").put(usermiddle, updateTheProfile)

module.exports = router
