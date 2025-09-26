const PROFESSIONS = Object.freeze({
  STUDENT: "student",
  TEACHER: "teacher",
  ENGINEER: "engineer",
  DOCTOR: "doctor",
  OTHER: "other",
})

const SOCIALLINKS = Object.freeze({
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  DISCORD: "discord",
})

const BLOGSTATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
})

const USERSTATUS = Object.freeze({
  ACTIVE: "active",
  NOT_ACTIVE: "notactive",
  BUSY: "busy",
})

const ATRISKUSERS = Object.freeze({
  SAFE: "safe",
  WARNING: "warning",
  DANGER: "danger",
})

module.exports = { PROFESSIONS, SOCIALLINKS, USERSTATUS, ATRISKUSERS }
