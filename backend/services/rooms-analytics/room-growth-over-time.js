const sendResponse = require("../../helpers/send-response")
const roomSchema = require("../../Models/rooms-mode")

class ROOMGROWTHOVERTIME {
  constructor() {
    this.Room = roomSchema
  }

  async getRoomGrowthOverTime(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear()

      const roomGrowth = await this.Room.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      const months = monthNames.map((name, index) => {
        const match = roomGrowth.find((item) => item._id === index + 1)
        return {
          month: name,
          count: match ? match.count : 0,
        }
      })
      return sendResponse(
        res,
        200,
        true,
        "Room Growth Over Time Fetched",
        months
      )
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      })
    }
  }
}

module.exports = ROOMGROWTHOVERTIME
