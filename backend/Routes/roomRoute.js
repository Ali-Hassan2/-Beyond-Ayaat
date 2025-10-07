const express = require("express")
const usermiddle = require("../Middlewares/usermiddleware")
const {
  createNewRoom,
  getOwnerRooms,
  allRooms,
  updateRoomInfo,
  deleteRoom,
  acceptRequest,
  rejectRequest,
} = require("../Controllers/rooms.Controller")
const checkOwner = require("../Middlewares/checkownerforroom")
const router = express.Router()

router.route("/createnewroom").post(usermiddle, createNewRoom)
router.route("/getyourrooms").get(checkOwner, usermiddle, getOwnerRooms)
router.route("/getallrooms").get(allRooms)
router.route("/upgraderoominfo").get(checkOwner, usermiddle, updateRoomInfo)
router.route("/deleteroom").delete(checkOwner, usermiddle, deleteRoom)
router
  .route("/acceptuserroomrequest")
  .post(checkOwner, usermiddle, acceptRequest)
router.route("rejectrequest").post(checkOwner, usermiddle, rejectRequest)

module.exports = router
