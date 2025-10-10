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

const messagesValidation = z.object({
  content: contentValidation,
  image: imageValidation,
})

module.exports = messagesValidation
