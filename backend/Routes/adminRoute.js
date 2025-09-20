const express = require("express");
const { adminLogin, adminSignup } = require("../Controllers/adminController");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/signup", adminSignup);

module.exports = router;
