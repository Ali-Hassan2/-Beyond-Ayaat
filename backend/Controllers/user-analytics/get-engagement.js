const userSchema = require("../../Models/user-model")
const sendResponse = require("../../Utils/send-response")

class TopUsersByEngagement {
  async getTopUsers(req, res) {
    try {
      const topUsers = await userSchema.aggregate([
        {
          $project: {
            first_name: 1,
            last_name: 1,
            email: 1,
            totalSavedBlogs: { $size: { $ifNull: ["$savedBlogs", []] } },
          },
        },
        { $sort: { totalSavedBlogs: -1 } },
        { $limit: 10 },
      ])

      const formatted = topUsers.map((user) => ({
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        value: user.totalSavedBlogs,
      }))

      return sendResponse(
        res,
        200,
        true,
        "Top users by saved blogs fetched successfully.",
        formatted
      )
    } catch (error) {
      console.error("Error fetching top users by engagement:", error)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = TopUsersByEngagement
