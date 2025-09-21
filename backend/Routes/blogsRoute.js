const express = require("express")
const {
  writeDraftBlog,
  completeBlog,
  publishBlog,
} = require("../Controllers/blogsController")
const router = express.Router()

router.post("/writeDraft", writeDraftBlog)
router.patch("/completeblog", completeBlog)
router.patch("/publishblog", publishBlog)

module.exports = router
