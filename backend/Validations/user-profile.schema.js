const z = require("zod")
const {
  PROFESSIONS,
  USERSTATUS,
  SOCIALLINKS,
} = require("../constants/constants")

const bioValidation = z.string().optional()
const professionValidation = z.enum(Object.values(PROFESSIONS)).optional()
const contactNumberValidation = z.string().optional()
const locationValidation = z.string().optional()
const statusValidation = z.enum(Object.values(USERSTATUS))
const educationValidation = z.string().optional()

const socialMediaLinksValidation = z
  .record(z.string(), z.string())
  .refine(
    (obj) =>
      Object.keys(obj).every((key) => Object.values(SOCIALLINKS).includes(key)),
    { message: "Invalid social media link key provided" }
  )
  .optional()

const userProfileValidation = z.object({
  bio: bioValidation,
  profession: professionValidation,
  education: educationValidation,
  status: statusValidation,
  contactNumber: contactNumberValidation,
  socialMediaLinks: socialMediaLinksValidation,
  location: locationValidation,
})

module.exports = userProfileValidation
