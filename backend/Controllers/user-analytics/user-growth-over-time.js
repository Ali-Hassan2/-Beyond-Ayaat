const { userprofileSchema } = require("../../Models/user-profile-model")
const sendResponse = require("../../Utils/send-response")

class UserGrowthOverTime {
  async growthOverTime(req, res) {
    try {
      const usergrowthdata = await userprofileSchema.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalUsers: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      const formattedGrowthData = usergrowthdata.map((item) => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleString(
          "en",
          {
            month: "short",
          }
        ),
        year: item._id.year,
        count: item.totalUsers,
      }))

      return sendResponse(
        res,
        200,
        true,
        "User Growth Data Fetched.",
        formattedGrowthData
      )
    } catch (error) {
      console.log("There is an error:", error)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = new UserGrowthOverTime()
