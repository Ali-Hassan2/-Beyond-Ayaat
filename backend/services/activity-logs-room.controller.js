const roomActivitySchema = require("../Models/activityLogsForRoom.model")

const getRoomActivityLogs = async (req, res) => {
  const { roomId } = req.params
  const { id: userid } = req.userid
  console.log("The room id is:", roomId)
  try {
    if (!userid) {
      return sendResponse(res, 400, false, "Please login first.")
    }
    const logs = await roomActivitySchema
      .find({ room_id: roomId })
      .populate("user_id", "first_name last_name email")
      .populate("target_user", "first_name last_name email")
      .sort({ createdAt: -1 })
    if (!logs || logs.length === 0) {
      return sendResponse(res, 400, false, "Sorry no logs found for this room.")
    }
    return res.status(200).json({
      success: true,
      message: "Room activity logs fetched successfully",
      data: logs,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error while fetching room activity logs",
      error: error.message,
    })
  }
}

module.exports = getRoomActivityLogs
