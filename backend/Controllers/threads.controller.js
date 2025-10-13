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
            userId,
            content,
          })
          message
            .save()
            .then(() =>
              roomActivitySchema.create({
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
      if (message) return sendResponse(res, 200, true, "Reply added.", message)
      else return sendResponse(res, 500, false, "Something went wrong.")
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = new thread()
