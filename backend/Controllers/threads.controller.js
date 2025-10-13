const roomActivitySchema = require("../Models/activityLogsForRoom.model")
const messageSchema = require("../Models/messages.model")
const roomSchema = require("../Models/rooms-mode")
const sendResponse = require("../Utils/send-response")
const repliesValidation = require("../Validations/reply_body.schema")
const { ROOMLOGS } = require("../constants/constants")

class thread {
  constructor() {
    this.model = { roomSchema, messageSchema, roomActivitySchema }
  }

  async parseReply(req, res) {
    try {
      const {
        userid: { id: userId } = {},
        params: { roomId, messageId } = {},
        body = {},
      } = req ?? {}
      const parseResult = repliesValidation.safeParse(body)
      const earlyError = !parseResult.success
        ? sendResponse(res, 400, false, "Please validate the body")
        : !userId
          ? sendResponse(res, 400, false, "Please provide userId.")
          : !roomId
            ? sendResponse(res, 400, false, "Please provide roomId")
            : !messageId
              ? sendResponse(res, 400, false, "Please provide the messageId.")
              : null
      if (earlyError) return earlyError
      const [room, message] = await Promise.all([
        roomSchema.findById(roomId),
        messageSchema.findById(messageId),
      ])
      let isMember = false
      if (room) {
        const uid = userId.toString()
        isMember =
          (room.owner && room.owner.toString() === uid) ||
          room?.admins.some((a) => a._id && a._id.toString() === uid) ||
          room?.member.some((m) => m._id && m._id.toString() === uid)
      }
      const validationError = !room
        ? "No Room Found"
        : !message
          ? "No message found."
          : !isMember
            ? "You are not a part of this Room."
            : null
      if (validationError) return sendResponse(res, 400, false, validationError)
      const content = parseResult?.data?.content?.trim?.()
      if (!content || content.length === 0)
        return sendResponse(res, 400, false, "No body found.")
      await new Promise((resolve, reject) => {
        try {
          message?.replies?.push?.({
            replier: userId,
            content,
          })
          message
            .save()
            .then(() =>
              roomActivitySchema.create({
                room_id: roomId,
                user_id: userId,
                actions: ROOMLOGS.GIVE_REPLY,
                details: `${userId} replied to a message: ${message?.content}`,
              })
            )
            .then(resolve)
            .catch(reject)
        } catch (error) {
          reject(error)
        }
      })
      const populatedMessage = await message.populate({
        path: "replies.replier",
        select: "first_name last_name",
      })
      if (populatedMessage)
        return sendResponse(res, 200, true, "Reply added.", populatedMessage)
      else return sendResponse(res, 500, false, "Something went wrong.")
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }

  async deleteReply(req, res) {
    try {
      const {
        userid: { id: userId } = {},
        params: { roomId, messageId, replyId } = {},
        body: {} = {},
      } = req ?? {}
      const earlyError = !userId
        ? sendResponse(res, 400, false, "Please provide userId.")
        : !roomId
          ? sendResponse(res, 400, false, "Please provide the roomId.")
          : !messageId
            ? sendResponse(res, 400, false, "Please provide the messageId.")
            : !replyId
              ? sendResponse(res, 400, false, "Please provide the replyId.")
              : null
      if (earlyError) return earlyError
      const [room, message] = await Promise.all([
        roomSchema.findById(roomId),
        messageSchema.findById(messageId),
      ])
      let isMember = false
      if (room) {
        const uid = userId.toString()
        isMember =
          (room.owner && room.owner.toString() === uid) ||
          room.admins?.some((a) => a._id && a._id.toString() === uid) ||
          room.member?.some((m) => m._id && m._id.toString() === uid)
      }
      const validationError = !room
        ? "No Room found."
        : !message
          ? "No message found."
          : !isMember
            ? "You are not a part of this room."
            : null
      if (validationError)
        return sendResponse(res, 400, false, validationError, null)
      let replyIndex = -1
      let reply = null
      for (let i = 0; i < (message?.replies?.length || 0); i++) {
        const r = message.replies[i]
        if (r._id && r._id.toString() === replyId.toString()) {
          replyIndex = i
          reply = r
          break
        }
      }
      if (replyIndex === -1)
        return sendResponse(res, 404, false, "Reply not found.")
      const replyAuthorId = (reply.replier || reply.userId)?.toString?.()
      const uid = userId.toString()
      const isOwner = room?.owner && room.owner.toString() === uid
      const isAdmin = room?.admins?.some(
        (a) => a._id && a._id.toString() === uid
      )
      const isAuthor = replyAuthorId && replyAuthorId === uid
      if (!isAuthor && !isOwner && !isAdmin)
        return sendResponse(
          res,
          403,
          false,
          "Unauthorized to delete this reply."
        )
      await new Promise((resolve, reject) => {
        try {
          message.replies.splice(replyIndex, 1)
          message
            .save()
            .then(() =>
              roomActivitySchema.create({
                room_id: roomId,
                user_id: userId,
                actions: ROOMLOGS.DELETE_REPLY,
                details: `${userId} deleted the reply on: ${message?.content}`,
              })
            )
            .then(resolve)
            .catch(reject)
        } catch (err) {
          reject(err)
        }
      })
      const populatedMessage = await message.populate({
        path: "replies.replier",
        select: "first_name last_name",
      })
      return populatedMessage
        ? sendResponse(
            res,
            200,
            true,
            "Reply deleted successfully",
            populatedMessage
          )
        : sendResponse(res, 500, false, "Something went wrong.", null)
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = thread
