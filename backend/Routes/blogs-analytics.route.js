const express = require("express")
const GROWTHOVERTIMEBLOGS = require("../Controllers/blogs-analytics/blogs-growth-over-time")
const { adminmiddle } = require("../Middlewares/adminmiddleware")
const BLOGCOMMENTSANALYTICS = require("../Controllers/blogs-analytics/top-and-least-interactive-blogs")
const BLOGSCATEGORYANALYTICS = require("../Controllers/blogs-analytics/blogs-category-analytics")
const router = express.Router()
const blogsanalyticsGrowth = new GROWTHOVERTIMEBLOGS()
const CommentedBlogsData = new BLOGCOMMENTSANALYTICS()
const CategoryBlogs = new BLOGSCATEGORYANALYTICS()
router.get(
  "/growthovertime",
  adminmiddle,
  blogsanalyticsGrowth.getBlogsOverTime.bind(blogsanalyticsGrowth)
)
router.get(
  "/topcommentedblogs",
  adminmiddle,
  CommentedBlogsData.getTopCommentedBlogsData.bind(CommentedBlogsData)
)
router.get(
  "/leastcommentedblogs",
  adminmiddle,
  CommentedBlogsData.getLeastCommentedBlogs.bind(CommentedBlogsData)
)
router.get(
  "/category-distribution",
  adminmiddle,
  CategoryBlogs.getCategoryDistribution.bind(CategoryBlogs)
)

module.exports = router
