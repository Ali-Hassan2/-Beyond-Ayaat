const { BLOGSTATUS } = require("../../constants/constants")
const blogsSchema = require("../../Models/blogs-model")
const sendResponse = require("../../Utils/send-response")

class GROWTHOVERTIMEBLOGS {
  constructor() {
    this.Blog = blogsSchema
  }

  async getBlogsOverTime(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear()
      const result = await this.Blog.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
            status: BLOGSTATUS.PUBLISHED,
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $dateToString: {
                format: "%b",
                date: { $dateFromParts: { year: year, month: "$_id", day: 1 } },
              },
            },
            count: 1,
          },
        },
      ])

      const allMonths = [
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

      const monthData = allMonths.map((m) => {
        const found = result.find((r) => r.month === m)
        return { month: m, count: found ? found.count : 0 }
      })
      return sendResponse(
        res,
        200,
        true,
        "Growth Over Time For Blogs Reterived",
        monthData
      )
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, "Server Error", [error?.message])
    }
  }
}
module.exports = GROWTHOVERTIMEBLOGS
