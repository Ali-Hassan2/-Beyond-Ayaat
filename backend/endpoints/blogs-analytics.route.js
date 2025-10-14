const express = require("express")
const GROWTHOVERTIMEBLOGS = require("../services/blogs-analytics/blogs-growth-over-time")
const { adminmiddle } = require("../interceptors/adminmiddleware")
const BLOGCOMMENTSANALYTICS = require("../services/blogs-analytics/top-and-least-interactive-blogs")
const BLOGSCATEGORYANALYTICS = require("../services/blogs-analytics/blogs-category-analytics")
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
