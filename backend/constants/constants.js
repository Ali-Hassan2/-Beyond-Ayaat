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

const ROOMLOGS = Object.freeze({
  JOINED: "joined",
  LEFT: "left",
  ACCESS_CHANGED: "access changed",
  ROLE_ASSIGNED: "role_assigned",
  ROLE_UPDATED: "role_updated",
  ROLE_REMOVED: "role_removed",
  MESSAGE_SENT: "message_sent",
  MESSAGE_DELETED: "message_deleted",
  ROOM_UPDATED: "room_updated",
  RULE_ADDED: "rule_added",
  RULE_UPDATED: "rule_updated",
  RULE_DELETED: "rule_deleted",
  REQUEST_ACCEPTED: "request_accepted",
  REQUEST_REJECTED: "request_rejected",
  ROOM_CREATED: "room_created",
  PIN_MESSAGE: "pin_message",
  UNPIN_MESSAGE: "unpin_message",
})

module.exports = {
  BLOGSTATUS,
  PROFESSIONS,
  SOCIALLINKS,
  USERSTATUS,
  ATRISKUSERS,
  REPORTINGREASONS,
  REQUEST_STATUS,
  ROOMROLES,
  ROOMLOGS,
}
