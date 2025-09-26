const express = require("express")
const {
  writeDraftBlog,
  completeBlog,
  publishBlog,
  giveComment,
  getRandomBlogs,
  editBlog,
  removeBlog,
  deleteComment,
} = require("../Controllers/blogsController")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.post("/writeDraft", usermiddle, writeDraftBlog)
router.patch("/completeblog", usermiddle, completeBlog)
router.patch("/publishblog", usermiddle, publishBlog)
router.post("/addcomment", usermiddle, giveComment)
router.route("/getrandomblogs").get(getRandomBlogs)
router.route("/editblog").patch(editBlog)
router.route("/removeblog").delete(removeBlog)
router.route("/deletecomment").delete(deleteComment)

module.exports = router
