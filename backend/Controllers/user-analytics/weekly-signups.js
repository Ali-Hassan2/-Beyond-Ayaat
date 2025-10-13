const userSchema = require("../../Models/user-model")
const sendResponse = require("../../Utils/send-response")

class WEEKLYSIGNUPS {
  async getWeeklySignUps(req, res) {
    try {
      const userSignUps = await userSchema.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              week: {
                $isoWeek: "$createdAt",
              },
            },
            totalSignUps: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.week": 1,
          },
        },
      ])
      const weekSignUps = userSignUps.map((itm) => ({
        week: `Week ${itm._id.week},${itm._id.year}`,
        count: itm.totalSignUps,
      }))
      return weekSignUps
        ? sendResponse(res, 200, true, "Week Signups retervied", weekSignUps)
        : sendResponse(res, 500, false, "Server Error", null)
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }
}

module.exports = WEEKLYSIGNUPS
