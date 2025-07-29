const express = require("express");
const adminmiddle = require("../Middlewares/adminmiddleware");
const {
  creatingsubtopic,
  gettingsubtopics,
} = require("../Controllers/subtopicController");
const router = express.Router();

router.post("/createsubtopic", adminmiddle, creatingsubtopic);
router.get("/getsubtopics", gettingsubtopics);

module.exports = router;
