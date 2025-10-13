const z = require("zod")

const replyBodyValidation = z.string().trim()

const repliesValidation = z.object({
  content: replyBodyValidation,
})

module.exports = repliesValidation
