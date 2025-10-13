const express = require("express")
const usermiddle = require("../Middlewares/usermiddleware")
const {
  sendMessages,
  getAllMessages,
  editMessage,
  deleteMessage,
  parseReaction,
  removeReaction,
  deleteReply,
} = require("../Controllers/messages.controller")
const { giveReply } = require("../Controllers/threads.controller")
const router = express.Router()

router.route("/:roomId/messages").post(usermiddle, sendMessages)
router.route("/:roomId/messages").get(usermiddle, getAllMessages)
router.route("/:roomId/messages/:messageId").patch(usermiddle, editMessage)
router.route("/:roomId/messages/:messageId").delete(usermiddle, deleteMessage)
router
  .route("/givereaction/room/:roomId/message/:messageId")
  .post(usermiddle, parseReaction)
router
  .route("/removereaction/room/:roomId/message/:messageId")
  .delete(usermiddle, removeReaction)
router
  .route("/givereply/room/:roomId/message/:messageId")
  .post(usermiddle, giveReply)

module.exports = router
