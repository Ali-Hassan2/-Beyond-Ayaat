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
  getMyRequests,
  addAdminRole,
  updateMemberRole,
  deleteMember,
  getRoomActivityLogs,
  getAllFilteredRooms,
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
  .route("/acceptuserroomrequest/room/:roomId/request/:userId")
  .put(usermiddle, checkOwner, acceptRequest)
router
  .route("/rejectrequest/room/:roomId/request/:requestId")
  .patch(usermiddle, checkOwner, rejectRequest)
router
  .route("/addadninroleformember/room/:roomId/member/:memberId")
  .post(usermiddle, checkOwner, addAdminRole)
router
  .route("/changeadminroletomember/room/:roomId/admin/:adminId")
  .patch(usermiddle, updateMemberRole)
router
  .route("/removeroomconsumer/room/:roomId/membertoremove/:memberId")
  .delete(usermiddle, deleteMember)
router
  .route("/:roomId/activitylogsforroom")
  .get(usermiddle, getRoomActivityLogs)
router.route("/getfilterrooms").get(getAllFilteredRooms)
module.exports = router
