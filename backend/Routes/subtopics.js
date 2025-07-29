const express = require("express");
const adminmiddle = require("../Middlewares/adminmiddleware");
const {
  creatingsubtopic,
  gettingsubtopics,
  deletingsubtopic,
} = require("../Controllers/subtopicController");
const router = express.Router();

router.post("/createsubtopic", adminmiddle, creatingsubtopic);
router.get("/getsubtopics", gettingsubtopics);
router.delete("/deletesubtopic/:id", adminmiddle, deletingsubtopic);

module.exports = router;
