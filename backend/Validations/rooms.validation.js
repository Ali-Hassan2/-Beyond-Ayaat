const z = require("zod")
const roomrules = require("../Models/rooms-rules")

const titleValidation = z.string()
const descriptionValidation = z.string()
const imageValidation = z
  .object({
    public_id: z.string().optional(),
    url: z.string().optional(),
  })
  .optional()
const isPublicValidation = z.boolean().default(true)
const requestValidation = z.array(z.string()).default([])
const subtopicIdValidation = z.string().nullable().default(null)
const topicIdValidation = z.string().nullable().default(null)
const memberValidation = z.array(z.string()).default([])
const room_rulesValidation = z.string().default(null).optional()
const messagesValidation = z.array(z.string()).nullable().default([])
const pinnedMessagesValidation = z
  .array(z.string())
  .nullable()
  .default([])
  .optional()
const adminRolevalidation = z
  .array(z.string())
  .nullable()
  .default([])
  .optional()
const roomsValidation = z.object({
  title: titleValidation,
  description: descriptionValidation,
  avatar: imageValidation,
  isPublic: isPublicValidation,
  requests: requestValidation,
  member: memberValidation,
  subtopicId: subtopicIdValidation,
  topicId: topicIdValidation,
  room_rules: room_rulesValidation,
  messages: messagesValidation,
  pinnedMessages: pinnedMessagesValidation,
  admins: adminRolevalidation,
})

module.exports = roomsValidation
