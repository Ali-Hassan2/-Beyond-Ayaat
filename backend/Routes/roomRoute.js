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
  joinPublicroom,
  changeaccessmode,
  addRoomRules,
  deleteRoomRules,
  upgradeRoomRules,
  pinMessage,
  unpinmessage,
  makerequest,
  getAllrequestsWithStatus,
  getMyRequests,
} = require("../Controllers/rooms.Controller")
const checkOwner = require("../Middlewares/checkownerforroom")
const router = express.Router()

router.route("/createnewroom").post(usermiddle, createNewRoom)
router.route("/joinroompublic").post(usermiddle, joinPublicroom)
router.route("/getyourrooms").get(usermiddle, getOwnerRooms)
router.route("/getallrooms").get(allRooms)
router
  .route("/addroomrules/descriptions/:id")
  .post(usermiddle, checkOwner, addRoomRules)
router
  .route("/deleteroomrules/:id")
  .delete(usermiddle, checkOwner, deleteRoomRules)
router
  .route("/upgraderoomrules/:id")
  .patch(usermiddle, checkOwner, upgradeRoomRules)
router.route("/:roomId/pinmessage/:messageId").post(usermiddle, pinMessage)
router.route("/:roomId/unpinmessage/:messageId").post(usermiddle, unpinmessage)
router
  .route("/changeaccessmode/:id")
  .patch(usermiddle, checkOwner, changeaccessmode)
router.route("/upgraderoominfo/:id").put(usermiddle, checkOwner, updateRoomInfo)
router.route("/deleteroom/:id").delete(usermiddle, checkOwner, deleteRoom)
router.route("/:roomId/createrequest").post(usermiddle, makerequest)
router.route("/getallyourrequestswithstatus").get(usermiddle, getMyRequests)
router
  .route("/acceptuserroomrequest")
  .post(checkOwner, usermiddle, acceptRequest)
router.route("/rejectrequest").post(checkOwner, usermiddle, rejectRequest)

module.exports = router
