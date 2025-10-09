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
    const image = req.files.image
    if (!req.files || Object.Keys(req.files).length === 0) {
      return sendResponse(res, 400, false, "Sorry no image found to upload.")
    }
    const allowed_formats = ["image/png", "image/jpeg"]
    if (!allowed_formats.includes(image.mimetype)) {
      return sendResponse(res, 400, false, "Sorry only support few formates")
    }
    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath)
    if (!uploadResult || uploadResult.error) {
      return sendResponse(res, 400, false, "Sorry cannot upload image.")
    }
    const { id: userId } = req.userid
    if (!userId) {
      return sendResponse(res, 400, false, "Please login to write a message.")
    }
    console.log("The sender id is:", userId)
    const room_id = req.params.room_id
    if (!room_id) {
      return sendResponse(res, 400, false, "Please give room id")
    }
    console.log("The room id is:", room_id)

    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "No Room Found.")
    }
    const issenderMemeber = isRoomExist.member.includes(userId)
    if (!issenderMemeber) {
      return sendResponse(
        res,
        400,
        false,
        "You are not a memeber of this room you cannot send messages."
      )
    }
    const newMessage = await messagesSchema.create({
      sender_id: userId,
      room_id: room_id,
      content: parseResult.data.content,
    })

    isRoomExist.member.push(newMessage._id)
    return sendResponse(res, 200, true, "Message Sent Successfully", newMessage)
  } catch (error) {
    console.log("There is an error ", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

module.exports = { sendMessages }
