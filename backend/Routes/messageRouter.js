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
  parseReply,
} = require("../Controllers/messages.controller")
const router = express.Router()

router.route("/:roomId/messages").post(usermiddle, sendMessages)
router.route("/:roomId/messages").get(usermiddle, getAllMessages)
router.route("/:roomId/messages/:messageId").patch(usermiddle, editMessage)
router.route("/:roomId/messages/:messageId").delete(usermiddle, deleteMessage)
router.route("/:roomId/parsereply/:messageId").post(usermiddle, parseReply)
router
  .route("/:roomId/deletereply/:messagId/reply/:replyId")
  .delete(usermiddle, deleteReply)
router
  .route("/:roomId/parsereaction/:messageId")
  .post(usermiddle, parseReaction)
router
  .route("/:roomId/deletereaction/:messageId/reactions/:reactionId")
  .delete(usermiddle, removeReaction)
module.exports = router
