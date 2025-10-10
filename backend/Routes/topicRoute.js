const express = require("express")
const { givetopics, singletopicget } = require("../Controllers/topicController")
const router = express.Router()

router.get("/gettopics", givetopics)
router.get("/gettopic/:id", singletopicget)
module.exports = router
