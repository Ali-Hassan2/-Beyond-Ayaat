const sendResponse = require("../../helpers/send-response")
const messageSchema = require("../../Models/messages.model")

class MOSTMESSAGESROOM {
  constructor() {
    this.MESSAGE = messageSchema
  }
  async getMostMessagesRooms(req, res) {
    try {
      const Message = await this.MESSAGE.aggregate([
        {
          $group: {
            _id: "$room_id",
            totalMessages: { $sum: 1 },
          },
        },
        { $sort: { totalMessages: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "roomschemas",
            localField: "_id",
            foreignField: "_id",
            as: "room",
          },
        },
        { $unwind: "$room" },
        {
          $project: {
            _id: 0,
            roomId: "$room._id",
            roomTitle: "$room.title",
            totalMessages: 1,
          },
        },
      ])
      return sendResponse(
        res,
        200,
        true,
        "TOP 5 ROOM WITH MOST MESSAGES FETCHED",
        Message
      )
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, "Server Error", [error?.message])
    }
  }
}

module.exports = MOSTMESSAGESROOM
