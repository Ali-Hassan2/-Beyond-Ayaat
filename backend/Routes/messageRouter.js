const express = require("express")
const usermiddle = require("../Middlewares/usermiddleware")
const {
  sendMessages,
  getAllMessages,
  editMessage,
  deleteMessage,
} = require("../Controllers/messages.controller")
const router = express.Router()

router.route("/:roomId/messages").post(usermiddle, sendMessages)
router.route("/:roomId/messages").get(usermiddle, getAllMessages)
router.route("/:roomId/messages/:messageId").patch(usermiddle, editMessage)
router.route("/:roomId/messages/:messageId").delete(usermiddle, deleteMessage)

module.exports = router
