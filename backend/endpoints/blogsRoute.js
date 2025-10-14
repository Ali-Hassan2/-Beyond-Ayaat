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
  getsingleblog,
} = require("../services/blogsController")
const usermiddle = require("../interceptors/usermiddleware")
const router = express.Router()

router.post("/writeDraft", usermiddle, writeDraftBlog)
router.patch("/completeblog", usermiddle, completeBlog)
router.patch("/publishblog", usermiddle, publishBlog)
router.post("/addcomment", usermiddle, giveComment)
router.route("/getrandomblogs").get(getRandomBlogs)
router.route("/editblog").patch(usermiddle, editBlog)
router.route("/removeblog").delete(usermiddle, removeBlog)
router.route("/deletecomment").delete(usermiddle, deleteComment)
router.route("/getsingleblogbyid").get(getsingleblog)

module.exports = router
