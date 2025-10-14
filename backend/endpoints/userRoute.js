const express = require("express")
const {
  userLogin,
  userSignup,
  googlelogin,
  logout,
  saveBlog,
  getSavedBlogs,
  getAllUsers,
} = require("../services/userController")
const usermiddle = require("../interceptors/usermiddleware")
const { adminmiddle } = require("../interceptors/adminmiddleware")
const router = express.Router()

router.post("/login", userLogin)
router.post("/signup", userSignup)
router.post("/logout", logout)
router.get("/getusers", adminmiddle, getAllUsers)
router.post("/google", googlelogin)
router.post("/saveblog", usermiddle, saveBlog)
router.get("/getsavedblogs", usermiddle, getSavedBlogs)

module.exports = router
