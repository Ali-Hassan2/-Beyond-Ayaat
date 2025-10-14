const express = require("express")
const { adminmiddle } = require("../interceptors/adminmiddleware")
const {
  creatingsubtopic,
  gettingsubtopics,
  deletingsubtopic,
  updatingsubtopic,
} = require("../services/subtopicController")
const router = express.Router()

router.post("/createsubtopic", adminmiddle, creatingsubtopic)
router.get("/getsubtopics", gettingsubtopics)
router.put("/updatesubtopic/:id", updatingsubtopic)
router.delete("/deletesubtopic/:id", adminmiddle, deletingsubtopic)

module.exports = router
