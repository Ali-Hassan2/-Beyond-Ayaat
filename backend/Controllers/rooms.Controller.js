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
    const room_id = req.params.id
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide roomId")
    }
    const isRoom = await roomSchema.findByIdAndDelete(room_id)
    if (!isRoom) {
      return sendResponse(res, 400, false, "No Room Founded Sorry.")
    }
    return sendResponse(res, 200, true, "Room deleted successfully")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const allRooms = async (req, res) => {}

const changeaccessmode = async (req, res) => {}

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
}
