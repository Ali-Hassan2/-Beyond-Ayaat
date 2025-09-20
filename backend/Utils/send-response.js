const sendResponse = (
  res,
  statusCode, // HTTP status code
  success, // true/false
  message, // response message
  data = null, // optional response payload
  errors = [] // optional array of error messages
) => {
  const responsePayload = {
    success,
    message,
  };

  if (data) responsePayload.data = data;
  if (errors.length > 0) responsePayload.errors = errors;

  return res.status(statusCode).json(responsePayload);
};

module.exports = sendResponse;
