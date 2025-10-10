const { REQUEST_STATUS } = require("../constants/constants")
const roomSchema = require("../Models/rooms-mode")
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
      .populate({
        path: "messages",
        select: "sender_id content",
        populate: {
          path: "sender_id",
          select: "first_name last_name",
        },
      })
      .populate({
        path: "pinnedMessages",
        select: "content sender_id",
        populate: {
          path: "sender_id",
          select: "first_name last_name",
        },
      })
      .limit(limit)
      .lean()

    const roomWithMemberCount = rooms.map((room) => ({
      ...room,
      memberCount: room.member ? room.member.length : 0,
    }))
    return sendResponse(
      res,
      200,
      true,
      "Rooms retrieved successfully.",
      roomWithMemberCount
    )
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
const updateRoomInfo = async (req, res) => {
  const parseResult = roomsValidation
    .partial()
    .pick({
      title: true,
      topicId: true,
      subtopicId: true,
      description: true,
      avatar: true,
    })
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
  const { id: user_id } = req.userid
  const room_id = req.params.id || req.params.roomId
  try {
    if (!user_id) {
      return sendResponse(res, 400, false, "Please login first", null)
    }
    const data = parseResult.data
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "Sorry, no room found.")
    }
    const isDataSame =
      isRoomExist.title === data.title &&
      isRoomExist.description === data.description &&
      isRoomExist.topicId?.toString() === data.topicId &&
      isRoomExist.subtopicId?.toString() === data.subtopicId &&
      isRoomExist.avatar === data.avatar
    if (isDataSame) {
      return sendResponse(
        res,
        400,
        false,
        "Please change something before updating."
      )
    }
    if (data.title) isRoomExist.title = data.title
    if (data.description) isRoomExist.description = data.description
    if (data.topicId) isRoomExist.topicId = data.topicId
    if (data.subtopicId) isRoomExist.subtopicId = data.subtopicId
    if (data.avatar) isRoomExist.avatar = data.avatar
    await isRoomExist.save()
    await isRoomExist.populate([
      {
        path: "topicId",
        select: "title description",
      },
      {
        path: "subtopicId",
        select: "title description",
      },
    ])
    return sendResponse(
      res,
      200,
      true,
      "Room data updated successfully.",
      isRoomExist
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const deleteRoom = async (req, res) => {
  const room_id = req.params.id || req.params.roomId
  const { id: user_id } = req.userid
  try {
    if (!user_id) {
      return sendResponse(res, 400, false, "Please login first", null)
    }
    const isRoomExist = await roomSchema.findByIdAndDelete(room_id)
    if (!isRoomExist) {
      return sendRespons(res, 400, false, "No room found.", null)
    }
    return sendResponse(res, 200, true, "Room Deleted Successfully")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}
const pinMessage = async (req, res) => {
  try {
    const { id: user_id } = req.userid
    const room_id = req.params.roomId
    const message_id = req.params.messageId

    if (!user_id) return sendResponse(res, 400, false, "Please login first.")
    if (!room_id)
      return sendResponse(res, 400, false, "Please provide the room ID.")
    if (!message_id)
      return sendResponse(res, 400, false, "Please provide the message ID.")
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist)
      return sendResponse(res, 400, false, "Sorry, no room found.")
    const messageExists = isRoomExist.messages?.includes(message_id)
    if (!messageExists)
      return sendResponse(res, 400, false, "Message not found in this room.")
    const isOwner = isRoomExist.owner.toString() === user_id.toString()
    const isMember = isRoomExist.member?.includes(user_id)
    if (!isOwner && !isMember) {
      return sendResponse(
        res,
        403,
        false,
        "Only room members or the owner can pin a message."
      )
    }
    if (isRoomExist.pinnedMessages?.includes(message_id)) {
      return sendResponse(res, 400, false, "Message already pinned.")
    }
    isRoomExist.pinnedMessages.push(message_id)
    await isRoomExist.save()
    await isRoomExist.populate({
      path: "pinnedMessages",
      select: "content sender_id createdAt",
    })
    return sendResponse(
      res,
      200,
      true,
      "Message pinned successfully.",
      isRoomExist
    )
  } catch (error) {
    console.error("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const unpinmessage = async (req, res) => {
  const room_id = req.params.id || req.params.roomId
  const message_id = req.params.messageId
  const { id: userId } = req.userid

  try {
    const validationError = !userId
      ? "Please login first."
      : !room_id
        ? "Please provide room ID."
        : !message_id
          ? "Please provide message ID to unpin."
          : null
    if (validationError) return sendResponse(res, 400, false, validationError)
    const isRoomExist = await roomSchema
      .findById(room_id)
      .populate("pinnedMessages")
    if (!isRoomExist)
      return sendResponse(res, 400, false, "Sorry, no room found.")
    const isOwner = isRoomExist.owner.toString() === userId.toString()
    const isMember = isRoomExist.member.some(
      (id) => id.toString() === userId.toString()
    )
    if (!isOwner && !isMember)
      return sendResponse(
        res,
        403,
        false,
        "Only room members or the owner can unpin a message."
      )
    const isPinned = isRoomExist.pinnedMessages.some(
      (msg) =>
        msg._id?.toString() === message_id.toString() ||
        msg.toString() === message_id.toString()
    )

    if (!isPinned)
      return sendResponse(res, 400, false, "This message is not pinned.")
    isRoomExist.pinnedMessages.pull(message_id)
    await isRoomExist.save()
    await isRoomExist.populate({
      path: "pinnedMessages",
      select: "content sender_id createdAt",
      populate: {
        path: "sender_id",
        select: "first_name last_name _id",
      },
    })

    return sendResponse(
      res,
      200,
      true,
      "Message unpinned successfully.",
      isRoomExist.pinnedMessages
    )
  } catch (error) {
    console.error("Error while unpinning message:", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}
const makerequest = async (req, res) => {
  const room_id = req.params.roomId
  const { id: user_id } = req.userid

  try {
    if (!user_id) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    if (!room_id) {
      return sendResponse(res, 400, false, "Please provide room id.")
    }
    const isRoomExist = await roomSchema.findById(room_id)
    if (!isRoomExist) {
      return sendResponse(res, 400, false, "Room not found.")
    }
    if (isRoomExist.isPublic) {
      return sendResponse(res, 400, false, "Room is not private.")
    }
    const isAlreadyMember = isRoomExist.member.includes(user_id)
    const isAlreadyRequested = isRoomExist.requests.some(
      (r) => r.user.toString() === user_id.toString()
    )
    if (isAlreadyMember) {
      return sendResponse(res, 400, false, "You are already a member.")
    }
    if (isAlreadyRequested) {
      return sendResponse(res, 400, false, "Request already sent.")
    }
    isRoomExist.requests.push({
      user: user_id,
      status: REQUEST_STATUS.PENDING,
    })
    await isRoomExist.save()
    await isRoomExist.populate("requests.user", "first_name last_name")
    return sendResponse(
      res,
      200,
      true,
      "Request sent successfully.",
      isRoomExist.requests
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Server Error", [error?.message])
  }
}

const getMyRequests = async (req, res) => {
  const { id: userId } = req.userid
  try {
    if (!userId) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    const rooms = await roomSchema
      .find({ "requests.user": userId })
      .populate("requests.user", "first_name last_name")
      .populate("owner", "first_name last_name")
      .populate("topicId", "title")
      .populate("subtopicId", "title")
      .select("title description owner topicId subtopicId requests")
    if (!rooms || rooms.length === 0) {
      return sendResponse(res, 200, true, "No requests found.", [])
    }
    const formatted = rooms.map((room) => {
      const reqDetail = room.requests.find(
        (r) => r.user._id.toString() === userId.toString()
      )
      return {
        room_id: room._id,
        room_title: room.title,
        room_description: room.description,
        topic: room.topicId?.title || null,
        subtopic: room.subtopicId?.title || null,
        owner: room.owner
          ? `${room.owner.first_name} ${room.owner.last_name}`
          : null,
        status: reqDetail?.status || "unknown",
      }
    })
    return sendResponse(
      res,
      200,
      true,
      "Requests fetched successfully.",
      formatted
    )
  } catch (error) {
    console.error("Error fetching user requests:", error)
    return sendResponse(res, 500, false, "Server Error", [error.message])
  }
}

const acceptRequest = async (req, res) => {
  const { userId, roomId } = req.params
  const { id: ownerId } = req.userid

  try {
    if (!ownerId) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    if (!roomId || !userId) {
      return sendResponse(res, 400, false, "Room ID and User ID are required.")
    }
    const room = await roomSchema
      .findById(roomId)
      .populate("requests.user", "first_name last_name")

    if (!room) {
      return sendResponse(res, 404, false, "Room not found.")
    }
    if (room.owner.toString() !== ownerId.toString()) {
      return sendResponse(
        res,
        403,
        false,
        "You are not authorized to accept requests for this room."
      )
    }
    const requestIndex = room.requests.findIndex(
      (r) =>
        r.user._id.toString() === userId.toString() &&
        r.status === REQUEST_STATUS.PENDING
    )
    if (requestIndex === -1) {
      return sendResponse(res, 400, false, "No pending request found.")
    }
    const approvedRequest = room.requests[requestIndex]
    approvedRequest.status = REQUEST_STATUS.APPROVED

    if (!room.member.includes(userId)) {
      room.member.push(userId)
    }
    room.requests.splice(requestIndex, 1)
    await room.save()
    await room.populate("member", "first_name last_name")

    return sendResponse(res, 200, true, "Request accepted successfully.", {
      room_id: room._id,
      room_title: room.title,
      accepted_user: approvedRequest.user,
      members: room.member,
    })
  } catch (error) {
    console.error("Error in acceptRequest:", error)
    return sendResponse(res, 500, false, "Server Error", [error.message])
  }
}

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
  makerequest,
  getMyRequests,
}
