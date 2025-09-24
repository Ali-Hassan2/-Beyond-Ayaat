const z = require("zod")

const contentValidation = z
  .string()
  .min(1, { message: "Comment should be 1 char long" })
  .max(100, { message: "Comment only can 100 chatrs long" })

const createdAtValidation = z
  .preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  )
  .default(() => new Date())

const commentsValidation = z.object({
  content: contentValidation,
  createdAt: createdAtValidation,
})

module.exports = commentsValidation
