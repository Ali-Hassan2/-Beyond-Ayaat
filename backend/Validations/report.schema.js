const z = require("zod")
const { REPORTINGREASONS } = require("../constants/constants")

const reasonValidation = z.enum(Object.values(REPORTINGREASONS))

const reportValidation = z.object({
  reason: reasonValidation,
})

module.exports = reportValidation
