const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const sendResponse = require("../Utils/send-response")

dotenv.config()
const usermiddle = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return sendResponse(res, 401, false, "unauthorized", {
      message: "No token provided",
      name: "Error",
      stack: new Error("No token provided").stack,
    })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD)
    req.userid = decoded
    next()
  } catch (error) {
    return sendResponse(res, 401, false, "unauthorized", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
  }
}

module.exports = usermiddle
