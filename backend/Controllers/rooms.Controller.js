const { roomSchema } = require("../Models/rooms-mode")
const roomruleSchema = require("../Models/rooms-rules")
const sendResponse = require("../Utils/send-response")
const roomsValidation = require("../Validations/rooms.validation")

const createNewRoom = async (req, res) => {
  const parseResult = roomsValidation.safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the body data.",
      parseResult.error.issues.map((er) => er?.message)
    )
  }
  try {
    const { id: owner } = req.userid
    if (!owner) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    console.log("The owner id is:", owner)
    const { topicId, subtopicId } = req.query
    if (!topicId || !subtopicId) {
      return sendResponse(res, 400, false, "Please selecet topic and subtopic")
    }
    console.log("The topic and subtopic id is:", { topicId, subtopicId })
    const data = parseResult.data
    console.log("The data we found is:", data)

    const payload = {
      title: data.title,
      description: data.description,
      topicId,
      subtopicId,
      avatar: data.avatar,
      owner,
      isPublic: data.isPublic,
      requests: data.requests,
    }
    const newRoom = new roomSchema(payload)
    await newRoom.save()

    return sendResponse(res, 200, true, "Room Created Successfully.", newRoom)
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const joinPublicroom = async (req, res) => {
  const { id: userId } = req.userid
  if (!userId) {
    return sendResponse(res, 400, false, "Only authenticated users can join.")
  }

  try {
    const { room_id } = req.query
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide roomId.")
    }
    const room = await roomSchema.findById(room_id)
    if (!room) {
      return sendResponse(res, 400, false, "No room found.")
    }
    if (!room.isPublic) {
      return sendResponse(res, 400, false, "Sorry, this room is private.")
    }
    const isAlreadyMember = room.member.includes(userId)
    if (!isAlreadyMember) {
      room.member.push(userId)
      await room.save()
      return sendResponse(res, 200, true, "Room joined successfully.")
    }
    return sendResponse(
      res,
      400,
      false,
      "You are already a member of this room."
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server error.", [error?.message])
  }
}

const getOwnerRooms = async (req, res) => {
  const { id: userId } = req.userid
  if (!userId) {
    return sendResponse(res, 400, false, "No owner found.")
  }
  console.log("The user id is:", userId)
  try {
    const rooms = await roomSchema
      .find({ owner: userId })
      .populate("topicId")
      .populate("subtopicId")
      .populate("member")
      .populate("requests")
      .populate("owner")
      .populate("room_rules")
      .sort({ "topicId.title": 1, "subtopicId.title": 1 })
    return sendResponse(res, 200, true, "Owner roomos fetched.", rooms)
  } catch (error) {
    console.log("The error is:", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const addRoomRules = async (req, res) => {
  const parseResult = roomsValidation
    .pick({ room_rules: true })
    .safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the rules.",
      parseResult.error.issues.map((err) => err?.message)
    )
  }
  try {
    const room_id = req.params.id
    console.log("The room idddddis:", room_id)
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide a roomId.")
    }
    const room = await roomSchema.findById(room_id)
    if (!room) {
      return sendResponse(res, 404, false, "Room not found.")
    }
    const { room_rules } = parseResult.data
    const newRules = await roomruleSchema.create({ rules: room_rules })
    room.room_rules = newRules._id
    await room.save()
    return sendResponse(res, 200, true, "Room rules added successfully.", room)
  } catch (error) {
    console.error("Error adding room rules:", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const deleteRoomRules = async (req, res) => {
  try {
    const { id: userId } = req.userid
    const roomId = req.params.roomId || req.params.id
    if (!userId) {
      return sendResponse(res, 400, false, "Please login first")
    }
    if (!roomId) {
      return sendResponse(res, 400, false, "Please provide roomId.", null)
    }
    const roomExist = await roomSchema.findById(roomId)
    if (!roomExist) {
      return sendResponse(res, 400, false, "Sorry no room found.")
    }
    const roomRules = roomExist.room_rules
    if (!roomRules) {
      return sendResponse(
        res,
        400,
        "Sorry there are no room rules associated with this room."
      )
    }
    await roomruleSchema.findByIdAndDelete(roomRules)
    roomExist.room_rules = null
    await roomExist.save()
    return sendResponse(res, 200, true, "Room Rules delete successfully")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const upgradeRoomRules = async (req, res) => {
  try {
    const room_id = req.params.id || req.params.roomId
    const { id: userId } = req.userid
    const room_rules = req.body?.room_rules
    if (!userId) {
      return sendResponse(res, 400, false, "Sorry please login first")
    }
    if (!room_id) {
      return sendResponse(res, 400, false, "Please Provide roomId.")
    }
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist)
      return sendResponse(res, 400, false, "Sorry no room found.")

    const roomRules = isRoomExist.room_rules
    if (!roomRules) {
      return sendResponse(
        res,
        400,
        false,
        "Sorry no rules associated with this room."
      )
    }
    const updatedRules = await roomruleSchema.findByIdAndUpdate(
      roomRules,
      {
        rules: room_rules,
      },
      { new: true }
    )

    return sendResponse(
      res,
      200,
      true,
      "Roon Rules updated succesfully",
      updatedRules
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendRespons(res, 500, false, "Server Error", [error?.message])
  }
}
const allRooms = async (req, res) => {
  try {
    let { limit } = req.query

    limit = Number(limit)
    if (isNaN(limit) || limit <= 0) {
      return sendResponse(
        res,
        400,
        false,
        "Please provide a valid limit (number > 0)."
      )
    }

    const rooms = await roomSchema
      .find({})
      .populate("owner", "first_name last_name")
      .populate("requests", "username email")
      .populate("member", "first_name last_name")
      .populate("room_rules", "rules")
      .populate("topicId", "title description")
      .populate("subtopicId", "title description")
      .limit(limit)
    return sendResponse(res, 200, true, "Rooms retrieved successfully.", rooms)
  } catch (error) {
    console.error("Error retrieving rooms:", error)
    return sendResponse(res, 500, false, "Server Error", [error.message])
  }
}

const changeaccessmode = async (req, res) => {
  const parseResult = roomsValidation
    .pick({ isPublic: true })
    .safeParse(req.body)

  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the body",
      parseResult.error.issues.map((err) => err?.message)
    )
  }

  try {
    const room_id = req.params.id || req.params.roomId
    const { id: user_id } = req.userid

    if (!user_id) {
      return sendResponse(res, 400, false, "Please login first")
    }

    const { isPublic } = parseResult.data
    const isRoomExist = await roomSchema.findById(room_id)

    if (!isRoomExist) {
      return sendResponse(res, 400, false, "Sorry no room found")
    }
    if (isRoomExist.isPublic === isPublic) {
      return sendResponse(res, 400, false, "Please change the status")
    }
    isRoomExist.isPublic = isPublic
    await isRoomExist.save()

    return sendResponse(
      res,
      200,
      true,
      `Room access updated successfully. Now public = ${isPublic}`,
      isRoomExist
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const pinMessage = async (req, res) => {}

const unpinmessage = async (req, res) => {}
const updateRoomInfo = async (req, res) => {}

const deleteRoom = async (req, res) => {}

const acceptRequest = async (req, res) => {}

const rejectRequest = async (req, res) => {}

module.exports = {
  createNewRoom,
  getOwnerRooms,
  allRooms,
  updateRoomInfo,
  deleteRoom,
  acceptRequest,
  rejectRequest,
  joinPublicroom,
  changeaccessmode,
  addRoomRules,
  deleteRoomRules,
  upgradeRoomRules,
  pinMessage,
  unpinmessage,
}
