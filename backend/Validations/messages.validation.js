const z = require("zod")

const senderIdValidation = z.string()
const roomIdValidation = z.string()
const contentValidation = z
  .string()
  .min(1, { message: "Message should be 1 char long enough" })
  .max(500, { message: "Too long to send." })

const messagesValidation = z.object({
  sender_id: senderIdValidation,
  room_id: roomIdValidation,
  content: contentValidation,
})

module.exports = messagesValidation
