const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  errors = []
) => {
  const responsePayload = {
    success,
    message,
  }

  if (data) responsePayload.data = data
  if (errors.length > 0) responsePayload.errors = errors

  return res.status(statusCode).json(responsePayload)
}

module.exports = sendResponse
