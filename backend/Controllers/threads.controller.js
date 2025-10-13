const sendResponse = require("../Utils/send-response")
const repliesValidation = require("../Validations/reply_body.schema")

const giveReply = async (req, res) => {
  const { id: userId } = req.userid
  const { roomId, messageId } = req.params
  const parseResult = repliesValidation.parse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the body",
      parseResult.error.issues.map((er) => er?.message)
    )
  }
  try {
    const validationError = !userId
      ? "Please provide userID"
      : !roomId
        ? "Please provide the roomId"
        : !messageId
          ? "Please provide the messageId"
          : null
    if (validationError) {
      return sendResponse(res, 400, false, validationError)
    }
  } catch (error) {}
}

const deleteReply = async (req, res) => {}

module.exports = { giveReply, deleteReply }
