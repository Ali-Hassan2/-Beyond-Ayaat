const express = require("express");
const {
  adminLogin,
  adminSignup,
  logout,
  getadmins,
  deleteadmin,
  updateadmin,
} = require("../Controllers/adminController");
const { adminmiddle } = require("../Middlewares/adminmiddleware");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/signup", adminmiddle, adminSignup);
router.post("/logout", adminmiddle, logout);
router.get("/getadmins", adminmiddle, getadmins);
router.delete("/deleteadmin/:id", adminmiddle, deleteadmin);
router.put("/updateadmin", adminmiddle, updateadmin);
module.exports = router;
