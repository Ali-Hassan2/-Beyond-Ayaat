const { BLOGSTATUS } = require("../../constants/constants")
const blogsSchema = require("../../Models/blogs-model")
const sendResponse = require("../../helpers/send-response")

class BLOGCOMMENTSANALYTICS {
  constructor() {
    this.Blog = blogsSchema
  }
  async getTopCommentedBlogsData(req, res) {
    try {
      const result = await this.Blog.aggregate([
        { $match: { status: BLOGSTATUS.PUBLISHED } },
        {
          $project: {
            title: 1,
            commentCount: { $size: "$comments" },
          },
        },
        { $sort: { commentCount: -1 } },
        { $limit: 5 },
      ])
      return sendResponse(
        res,
        200,
        true,
        "Top Commented Blogs Reterived",
        result
      )
    } catch (error) {
      console.log(`There is an Error: ${error}`)
      return sendResponse(res, 500, false, "Server Error", [error?.message])
    }
  }

  async getLeastCommentedBlogs(req, res) {
    try {
      const result = await this.Blog.aggregate([
        { $match: { status: BLOGSTATUS.PUBLISHED } },
        {
          $project: {
            title: 1,
            commentCount: { $size: "$comments" },
          },
        },
        {
          $sort: {
            commentCount: 1,
          },
        },
        {
          $limit: 5,
        },
      ])
      return sendResponse(
        res,
        200,
        true,
        "Least Commented Blogs Reterived",
        result
      )
    } catch (error) {
      console.log("There is an error", error)
      return sendResponse(res, 500, false, "Server Error", [erro?.message])
    }
  }
}

module.exports = BLOGCOMMENTSANALYTICS
