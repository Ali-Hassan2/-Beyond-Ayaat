const blogsSchema = require("../../Models/blogs-model")
const sendResponse = require("../../Utils/send-response")
const { BLOGSTATUS } = require("../../constants/constants")

class BLOGSCATEGORYANALYTICS {
  constructor() {
    this.Blog = blogsSchema
  }

  async getCategoryDistribution(req, res) {
    try {
      const result = await this.Blog.aggregate([
        { $match: { status: BLOGSTATUS.PUBLISHED } },
        {
          $group: {
            _id: "$topic_id",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "topics",
            localField: "_id",
            foreignField: "_id",
            as: "topic",
          },
        },
        {
          $unwind: "$topic",
        },
        {
          $project: {
            _id: 0,
            category: "$topic.title",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ])

      return sendResponse(
        res,
        200,
        true,
        "Category Distribution Retrieved",
        result
      )
    } catch (err) {
      console.error("Error in getCategoryDistribution:", err)
      return sendResponse(res, 500, "Server Error", [err.message])
    }
  }
}

module.exports = BLOGSCATEGORYANALYTICS
