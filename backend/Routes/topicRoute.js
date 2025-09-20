const express = require("express");
const { givetopics } = require("../Controllers/topicController");
const router = express.Router();

router.get("/gettopics", givetopics);

module.exports = router;
