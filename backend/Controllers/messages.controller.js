const { ROOMLOGS } = require("../constants/constants")
const roomActivitySchema = require("../Models/activityLogsForRoom.model")
const messageSchema = require("../Models/messages.model")
const roomSchema = require("../Models/rooms-mode")
const sendResponse = require("../Utils/send-response")
const messagesValidation = require("../Validations/messages.validation")
const cloudinary = require("cloudinary").v2

const sendMessages = async (req, res) => {
  const parseResult = messagesValidation.safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate body",
      parseResult.error.issues.map((err) => err?.message)
    )
  }

  try {
    const { id: userId } = req.userid || {}
    if (!userId) {
      return sendResponse(res, 400, false, "Please login to write a message.")
    }
    console.log("The user id for message is:", userId)
    const room_id = req.params.roomId
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide room id.")
    }
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "No Room Found.")
    }
    if (
      !isRoomExist.member.some(
        (me) => me._id && me._id.toString() === userId.toString()
      )
    ) {
      return sendResponse(res, 400, false, "You are not a member of this room.")
    }
    let imageData = null
    if (req.files && req.files.image) {
      const image = req.files.image
      const allowed_formats = ["image/png", "image/jpeg"]
      if (!allowed_formats.includes(image.mimetype)) {
        return sendResponse(res, 400, false, "Sorry only support few formats.")
      }
      const uploadResult = await cloudinary.uploader.upload(image.tempFilePath)
      if (!uploadResult || uploadResult.error) {
        return sendResponse(res, 400, false, "Sorry cannot upload image.")
      }
      imageData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      }
    }
    const newMessage = await messageSchema.create({
      sender_id: userId,
      room_id: room_id,
      content: parseResult.data.content,
      image: imageData,
    })
    isRoomExist.messages.push(newMessage._id)
    await isRoomExist.save()
    await newMessage.populate("sender_id", "first_name last_name")
    await newMessage.populate("room_id", "title")
    return sendResponse(res, 200, true, "Message Sent Successfully", newMessage)
  } catch (error) {
    console.log("There is an error ", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const getAllMessages = async (req, res) => {
  try {
    const { id: userId } = req.userid || {}
    if (!userId) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    const room_id = req.params.roomId
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide room id.")
    }
    const room = await roomSchema.findById(room_id).populate({
      path: "messages",
      populate: { path: "sender_id", select: "first_name last_name" },
      populate: { path: "room_id", select: "title" },
    })
    if (!room) {
      return sendResponse(res, 400, false, "No Room Found.")
    }
    const isMember = room.member.some(
      (me) => me._id && me._id.toString() === userId.toString()
    )
    if (!isMember) {
      return sendResponse(res, 403, false, "You are not a member of this room.")
    }
    return sendResponse(
      res,
      200,
      true,
      "Messages retrieved successfully.",
      room.messages
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const editMessage = async (req, res) => {
  try {
    const parseResult = messagesValidation
      .pick({ content: true })
      .safeParse(req.body)
    if (!parseResult.success)
      return sendResponse(
        res,
        400,
        false,
        "Invalid request body",
        parseResult.error.issues
      )
    const { id: userId } = req.userid || {}
    const { roomId, messageId } = req.params
    const { content } = parseResult.data
    if (!userId) return sendResponse(res, 400, false, "Please login first.")
    if (!roomId) return sendResponse(res, 400, false, "Room ID is required.")
    if (!messageId)
      return sendResponse(res, 400, false, "Message ID is required.")
    const room = await roomSchema.findById(roomId)
    if (!room) return sendResponse(res, 404, false, "Room not found.")
    if (
      !room.member.some(
        (me) => me._id && me._id.toString() === userId.toString()
      )
    )
      return sendResponse(res, 403, false, "You are not a member of this room.")
    const message = await messageSchema.findById(messageId)
    if (!message) return sendResponse(res, 404, false, "Message not found.")
    if (message.content === content)
      return sendResponse(
        res,
        400,
        false,
        "Please modify content before saving."
      )
    await messageSchema.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    )
    return sendResponse(res, 200, true, "Message updated successfully.")
  } catch (error) {
    console.error("Error editing message:", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const deleteMessage = async (req, res) => {
  try {
    const room_id = req.params.roomId
    const { id: user_id } = req.userid
    const message_id = req.params.messageId
    if (!user_id) return sendResponse(res, 400, false, "Please login first.")
    if (!room_id) return sendResponse(res, 400, false, "Please provide roomId.")
    if (!message_id)
      return sendResponse(res, 400, false, "Please provide messageId.")
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) return sendResponse(res, 400, false, "No room found.")
    const isMember = isRoomExist.member.find(
      (r) => r._id.toString() === user_id.toString()
    )
    if (!isMember)
      return sendResponse(res, 403, false, "Sorry, you are not a member.")
    const isMessage = await messageSchema.findById(message_id)
    if (!isMessage)
      return sendResponse(res, 400, false, "Sorry, message not found.")
    const isSender = isMessage.sender_id.toString() === user_id.toString()
    if (!isSender)
      return sendResponse(
        res,
        403,
        false,
        "Only sender can delete this message."
      )
    await messageSchema.findByIdAndDelete(message_id)
    await roomSchema.updateOne(
      { _id: room_id },
      { $pull: { messages: message_id, pinnedMessages: message_id } }
    )
    return sendResponse(res, 200, true, "Message deleted successfully.")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}
const parseReaction = async (req, res) => {
  const { id: userId } = req.userid
  const { roomId, messageId } = req.params
  try {
    const validationError = !userId
      ? "Please login first"
      : !roomId
        ? "Please provide roomId"
        : !messageId
          ? "Please provide messageId"
          : null
    if (validationError) return sendResponse(res, 400, false, validationError)
    const room = await roomSchema.findById(roomId)
    const message = await messageSchema.findById(messageId)
    if (!room) return sendResponse(res, 400, false, "No Room Found.")
    if (!message) return sendResponse(res, 400, false, "No Message Found.")
    const isMember =
      (room.owner && room.owner.toString() === userId) ||
      room.admins.some((a) => a._id?.toString() === userId) ||
      room.member.some((m) => m._id?.toString() === userId)
    if (!isMember)
      return sendResponse(res, 400, false, "You are not a member of this room.")
    const { emoji } = req.body
    if (!emoji) return sendResponse(res, 400, false, "Please provide an emoji.")
    const existingReaction = message.reactions.find(
      (r) => r.reacter?.toString() === userId.toString()
    )
    if (existingReaction) {
      existingReaction.emoji = emoji
    } else {
      message.reactions.push({ reacter: userId, emoji })
    }
    await message.save()
    await roomActivitySchema.create({
      room_id: roomId,
      user_id: userId,
      actions: ROOMLOGS.REACTION_ADDED,
      target_user: messageId,
      details: `User ${userId} added a reaction to message: "${message.content}"`,
    })
    return sendResponse(res, 200, true, "Reaction added/updated", message)
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const removeReaction = async (req, res) => {
  const { id: userId } = req.userid
  const { roomId, messageId } = req.params
  try {
    const validationError = !userId
      ? "Please login first"
      : !roomId
        ? "Please provide roomId"
        : !messageId
          ? "Please provide messageId"
          : null
    if (validationError) return sendResponse(res, 400, false, validationError)
    const room = await roomSchema.findById(roomId)
    if (!room) return sendResponse(res, 400, false, "No Room Found.")
    const message = await messageSchema.findById(messageId)
    if (!message) return sendResponse(res, 400, false, "No Message Found.")
    const isMember =
      (room.owner && room.owner.toString() === userId) ||
      room.admins.some((a) => a._id?.toString() === userId) ||
      room.member.some((m) => m._id?.toString() === userId)
    if (!isMember)
      return sendResponse(
        res,
        400,
        false,
        "You have no authority to remove this reaction."
      )
    const reactionIndex = message.reactions.findIndex(
      (r) => r.reacter?.toString() === userId.toString()
    )
    if (reactionIndex === -1)
      return sendResponse(res, 400, false, "No reaction found.")
    message.reactions.splice(reactionIndex, 1)
    await message.save()
    await roomActivitySchema.create({
      room_id: roomId,
      user_id: userId,
      actions: ROOMLOGS.REACTION_REMOVED,
      target_user: messageId,
      details: `User ${userId} removed a reaction on message: "${message.content}"`,
    })
    return sendResponse(
      res,
      200,
      true,
      "Reaction removed successfully",
      message
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const parseReply = async (req, res) => {}

const deleteReply = async (req, res) => {}

module.exports = {
  sendMessages,
  getAllMessages,
  editMessage,
  deleteMessage,
  parseReply,
  deleteReply,
  parseReaction,
  removeReaction,
}
