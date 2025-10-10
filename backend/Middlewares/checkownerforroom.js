const { roomSchema } = require("../Models/rooms-mode")
const sendResponse = require("../Utils/send-response")

const checkOwner = async (req, res, next) => {
  try {
    const room_id = req.params.id || req.params.roomId
    const userId = req.userid.id || req.userid
    console.log("The room_id is:", room_id)
    console.log("The user id is:", userId)
    if (!room_id) {
      return sendResponse(res, 400, false, "Only Room owner can do this.")
    }
    const room_finded = await roomSchema.findById(room_id)
    if (!room_finded) {
      return sendResponse(res, 200, false, "No Room Founded.")
    }
    if (room_finded.owner.toString() !== userId) {
      return sendResponse(res, 400, false, "Forbbiden", {
        message: "You are not the owner of the Room.",
      })
    }
    console.log("Yes this person is the owner")
    next()
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", {
      message: error?.message,
      name: error.name,
      stack: error.stack,
    })
  }
}

module.exports = checkOwner
