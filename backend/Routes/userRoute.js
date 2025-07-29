const express = require("express");
const {
  userLogin,
  userSignup,
  googlelogin,
} = require("../Controllers/userController");
const router = express.Router();

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/google", googlelogin);

module.exports = router;
