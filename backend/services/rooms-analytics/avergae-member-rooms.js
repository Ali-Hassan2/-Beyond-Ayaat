const roomSchema = require("../../Models/rooms-mode")

class AVERAGEMEMBERSPERROOM {
  constructor() {
    this.Room = roomSchema
  }
  async getAverageMembersPerRoom(req, res) {
    try {
      const result = await this.Room.aggregate([
        {
          $project: {
            memberCount: { $size: { $ifNull: ["$member", []] } },
          },
        },
        {
          $group: {
            _id: null,
            totalMembers: { $sum: "$memberCount" },
            totalRooms: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            averageMembersPerRoom: {
              $cond: [
                { $eq: ["$totalRooms", 0] },
                0,
                { $divide: ["$totalMembers", "$totalRooms"] },
              ],
            },
          },
        },
      ])

      return res.status(200).json({
        success: true,
        data: result[0] || { averageMembersPerRoom: 0 },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = AVERAGEMEMBERSPERROOM
