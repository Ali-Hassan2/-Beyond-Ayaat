const express = require("express")
const {
  userLogin,
  userSignup,
  googlelogin,
  logout,
  saveBlog,
  getSavedBlogs,
} = require("../Controllers/userController")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.post("/login", userLogin)
router.post("/signup", userSignup)
router.post("/logout", logout)
router.post("/google", googlelogin)
router.post("/saveblog", usermiddle, saveBlog)
router.get("/getsavedblogs", usermiddle, getSavedBlogs)

module.exports = router
