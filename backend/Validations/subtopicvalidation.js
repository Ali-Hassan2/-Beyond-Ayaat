const z = require("zod")

const subtopicvalidation = z.object({
  title: z.string().min(1, { message: "title is required." }),
  description: z.string().min(1, { message: "description is required." }),
  topic_id: z.string().min(1, { message: "Topic id is required." }),
  image: z
    .object({
      public_id: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  summary: z.string().min(1, { message: "Summary is required." }),
})
module.exports = subtopicvalidation
