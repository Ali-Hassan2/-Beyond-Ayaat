const express = require("express")
const {
  makereport,
  getallreportsbyme,
  getallreportsagainstme,
} = require("../Controllers/report-controller")
const usermiddle = require("../Middlewares/usermiddleware")
const router = express.Router()

router.post("/makereport/:id", usermiddle, makereport)
router.get("/getreportsbyme", usermiddle, getallreportsbyme)
router.get("/getreportsagainstme", usermiddle, getallreportsagainstme)

module.exports = router
