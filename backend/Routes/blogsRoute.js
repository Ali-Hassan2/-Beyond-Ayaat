const express = require("express")
const {
  writeDraftBlog,
  completeBlog,
  publishBlog,
  giveComment,
  getallblogs,
} = require("../Controllers/blogsController")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.post("/writeDraft", usermiddle, writeDraftBlog)
router.patch("/completeblog", usermiddle, completeBlog)
router.patch("/publishblog", usermiddle, publishBlog)
router.post("/addcomment", usermiddle, giveComment)
router.get("/getallblogs", getallblogs)

module.exports = router
