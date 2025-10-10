const messagesSchema = require("../Models/messages.model")
const { roomSchema } = require("../Models/rooms-mode")
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
    const room_id = req.params.roomId
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide room id.")
    }
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "No Room Found.")
    }
    if (!isRoomExist.member.includes(userId)) {
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
    const newMessage = await messagesSchema.create({
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
    const isMember = room.member.includes(userId)
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
    if (!room.member.includes(userId))
      return sendResponse(res, 403, false, "You are not a member of this room.")
    const message = await messagesSchema.findById(messageId)
    if (!message) return sendResponse(res, 404, false, "Message not found.")
    if (message.content === content)
      return sendResponse(
        res,
        400,
        false,
        "Please modify content before saving."
      )
    await messagesSchema.findByIdAndUpdate(
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
    if (!user_id) {
      return sendResponse(res, 400, false, "Please login first")
    }
    console.log("The user id we got is:", user_id)
    if (!room_id)
      return sendResponse(res, 400, false, "Sorry Please provide roomId")

    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "No room found.")
    }
    const isMember = isRoomExist.member.includes(user_id)
    if (!isMember) {
      return sendResponse(res, false, 400, "Sorry you are not a member.")
    }
    const message_id = req.params.messageId
    const isMessage = await messagesSchema.findById(message_id)
    if (!message_id) {
      return sendResponse(res, 400, false, "Sorry not message Found.")
    }
    const isSender = isMessage.sender_id.toString() === user_id.toString()
    if (!isSender) {
      return sendResponse(
        res,
        400,
        false,
        "Sorry only sender can delete his message."
      )
    }

    await messagesSchema.findByIdAndDelete(message_id)
    return sendResponse(res, 200, true, "Message deleted.")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const parseReply = async (req, res) => {}

const deleteReply = async (req, res) => {}

const parseReaction = async (req, res) => {}

const removeReaction = async (req, res) => {}

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
