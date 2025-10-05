const express = require("express")
const {
  customizeProfile,
  getUserProfile,
  updateTheProfile,
} = require("../Controllers/user-profile-controller")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.route("/customizeyourprofile").post(usermiddle, customizeProfile)
router.route("/getuserprofile").get(usermiddle, getUserProfile)
router.route("/upgradeuserprofile/:id").put(usermiddle, updateTheProfile)

module.exports = router
