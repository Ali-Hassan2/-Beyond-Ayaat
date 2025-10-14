const express = require("express")
const ROOMGROWTHOVERTIME = require("../services/rooms-analytics/room-growth-over-time")
const { adminmiddle } = require("../interceptors/adminmiddleware")
const MOSTMESSAGESROOM = require("../services/rooms-analytics/most-messages-rooms")
const AVERAGEMEMBERSPERROOM = require("../services/rooms-analytics/avergae-member-rooms")
const PRIVATEPUBLIC = require("../services/rooms-analytics/private-public")

const router = express.Router()
const roomGrowth = new ROOMGROWTHOVERTIME()
const mostMessagesRooms = new MOSTMESSAGESROOM()
const averageMember = new AVERAGEMEMBERSPERROOM()
const privatePublic = new PRIVATEPUBLIC()

router.get(
  "/growthovertime",
  adminmiddle,
  roomGrowth.getRoomGrowthOverTime.bind(roomGrowth)
)
router.get(
  "/top5mostmessagesrooms",
  adminmiddle,
  mostMessagesRooms.getMostMessagesRooms.bind(mostMessagesRooms)
)
router.get(
  "/getaveragememberforrooms",
  adminmiddle,
  averageMember.getAverageMembersPerRoom.bind(averageMember)
)
router.get(
  "/getprivatepublicrooms",
  adminmiddle,
  privatePublic.getPrivatePublic.bind(privatePublic)
)

module.exports = router
