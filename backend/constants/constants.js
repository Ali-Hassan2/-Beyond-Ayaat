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

const REQUEST_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
})

const REPORTINGREASONS = Object.freeze({
  INAPPROPRIATE_LANGUAGE: "Foul or disrespectful language",
  HATE_SPEECH: "Hate or sectarian speech",
  BLASPHEMY: "Disrespect to Allah, Prophets, or Qur’an",
  HARASSMENT: "Bullying or mocking others",
  INAPPROPRIATE_CONTENT: "Indecent or immoral content",
  MISINFORMATION: "False Islamic information",
  PROMOTING_HARAM: "Promoting haram activities",
  SPAM: "Spam or unwanted ads",
  EXTREMISM: "Violent or extremist content",
  PRIVACY_VIOLATION: "Sharing private information",
  OTHER: "Other",
})

const ROOMROLES = Object.freeze({
  MEMBER: "member",
  ADMIN: "admin",
})

module.exports = {
  PROFESSIONS,
  SOCIALLINKS,
  USERSTATUS,
  ATRISKUSERS,
  REPORTINGREASONS,
  REQUEST_STATUS,
  ROOMROLES,
}
