const z = require("zod")

const titleValidation = z.string()
const descriptionValidation = z.string()
const imageValidation = z.object({
  public_id: z.string().optional(),
  url: z.string().optional(),
})
const ownerValidation = z.string().min(1, { message: "User is required." })
const isPublicValidation = z.boolean().default(true)
const requestValidation = z.array(z.string()).default([])
const memberValidation = z.array(z.string()).default([])

const roomsValidation = z.object({
  title: titleValidation,
  description: descriptionValidation,
  avatar: imageValidation,
  owner: ownerValidation,
  isPublic: isPublicValidation,
  requests: requestValidation,
  member: memberValidation,
})

export { roomsValidation }
