const z = require("zod")

const rulesValidation = z
  .string()
  .min(1, { message: "Please provide some rules." })
  .max(700, { message: "Maximum you can give upto 700 char rules." })
const createdAtValidation = z.date().default(() => new Date())

const roomrulesValidation = z.object({
  rules: rulesValidation,
  createdAt: createdAtValidation,
})

module.exports = rulesValidation
