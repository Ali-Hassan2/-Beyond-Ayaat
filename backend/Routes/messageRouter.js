const express = require("express")
const usermiddle = require("../Middlewares/usermiddleware")
const { sendMessages } = require("../Controllers/messages.controller")
const router = express.Router()

router.route("/:roomId/messages").post(usermiddle, sendMessages)
router.route("/messages").get(sendMessages)
router.route("/:roomId/messages/:messageId").patch(usermiddle, sendMessages)
router.route("/:roomId/messages/:messageId").patch(usermiddle, sendMessages)

module.exports = router
