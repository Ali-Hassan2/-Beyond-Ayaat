const express = require("express")
const customizeProfile = require("../Controllers/user-profile-controller")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()
router.route("/customizeyourprofile").post(usermiddle, customizeProfile)

module.exports = router
