const z = require("zod")

const replyBodyValidation = z
  .array(z.string())
  .nullable()
  .default([])
  .optional()

const repliesValidation = z.object({
  reply: replyBodyValidation,
})

module.exports = repliesValidation
