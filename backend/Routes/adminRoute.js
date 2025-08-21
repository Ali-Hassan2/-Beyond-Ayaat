const express = require("express");
const {
  adminLogin,
  adminSignup,
  logout,
} = require("../Controllers/adminController");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/signup", adminSignup);
router.post("/logout", logout);

module.exports = router;
