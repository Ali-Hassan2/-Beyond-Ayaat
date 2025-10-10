const z = require("zod")

const userIdValidation = z.string().min(1, { message: "User ID is required" })
const subtopicIdValidation = z
  .string()
  .min(1, { message: "Subtopic ID is required" })
const topicIdValidation = z.string().min(1, { message: "Topic ID is required" })
const createdAtValidation = z.date().default(() => new Date())
const titleValidation = z
  .string()
  .min(5, { message: "Title should be minimum 5 chars long" })
  .max(100, { message: "Title cannot exceed 100 chars" })
const contentValidation = z
  .string()
  .min(10, { message: "Content should be minimum 10 chars long" })
  .max(500, { message: "Content should not exceed 500 chars" })
const statusValidation = z.string()
const imageValidation = z
  .object({
    public_id: z.string().optional(),
    url: z.string().optional(),
  })
  .optional()

const blogsValidation = z.object({
  userId: userIdValidation,
  subtopicId: subtopicIdValidation,
  topicId: topicIdValidation,
  createdAt: createdAtValidation,
  title: titleValidation,
  content: contentValidation,
  image: imageValidation,
  status: statusValidation,
})

module.exports = blogsValidation
