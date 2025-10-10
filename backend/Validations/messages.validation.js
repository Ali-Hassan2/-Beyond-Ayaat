const z = require("zod")

const contentValidation = z
  .string()
  .min(1, { message: "Message should be 1 char long enough" })
  .max(500, { message: "Too long to send." })
const imageValidation = z
  .object({
    public_id: z.string().optional(),
    url: z.string().optional(),
  })
  .optional()
const reactionsValidation = z
  .array(
    z.object({
      reacter: z.string().min(1),
      emoji: z.string().min(1),
    })
  )
  .optional()
  .default([])
const repliesValidation = z
  .array(
    z.object({
      replier: z.string().min(1),
      content: z.string().min(1).max(500),
    })
  )
  .optional()
  .default([])

const messagesValidation = z.object({
  content: contentValidation,
  image: imageValidation,
  reactions: reactionsValidation,
  replies: repliesValidation,
})

module.exports = messagesValidation
