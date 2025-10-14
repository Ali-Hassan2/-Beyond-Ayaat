const sendResponse = require("../../helpers/send-response")
const roomSchema = require("../../Models/rooms-mode")

class PRIVATEPUBLIC {
  constructor() {
    this.ROOM = roomSchema
  }

  async getPrivatePublic(req, res) {
    try {
      const room = await this.ROOM.aggregate([
        {
          $group: {
            _id: "$isPublic",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: {
              $cond: [{ $eq: ["$_id", true] }, "Public", "Private"],
            },
            count: 1,
          },
        },
      ])
      return sendResponse(res, 200, true, "Private Public Rooms fetched", room)
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}
module.exports = PRIVATEPUBLIC
