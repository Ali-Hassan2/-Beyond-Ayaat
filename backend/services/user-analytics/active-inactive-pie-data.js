const { userprofileSchema } = require("../../Models/user-profile-model")
const sendResponse = require("../../helpers/send-response")

class ActiveVsInactiveUsers {
  async getStatus(req, res) {
    try {
      const data = await userprofileSchema.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])

      const formatted = data
        ? data.map((item) => ({
            name: item._id || "Unknown",
            value: item.count,
          }))
        : []

      return sendResponse(
        res,
        200,
        true,
        "Active vs Inactive Users fetched.",
        formatted
      )
    } catch (error) {
      console.error("Error fetching user activity stats:", error)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = new ActiveVsInactiveUsers()
