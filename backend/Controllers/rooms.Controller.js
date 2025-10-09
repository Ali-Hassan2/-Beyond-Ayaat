const { roomSchema } = require("../Models/rooms-mode")
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

const joinPublicroom = async (req, res) => {}

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
      .sort({ "topicId.title": 1, "subtopicId.title": 1 })
    return sendResponse(res, 200, true, "Owner roomos fetched.", rooms)
  } catch (error) {
    console.log("The error is:", error)
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
}
