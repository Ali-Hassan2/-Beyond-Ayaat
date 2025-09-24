const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const sendResponse = require("../Utils/send-response")

dotenv.config()
const usermiddle = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return sendResponse(res, 400, false, "No token provided")
  }

  const token = authHeader.split(" ")[1]
  console.log("We got the token", token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD)
    req.userid = decoded
    console.log("The user id is:", req.userid)
    next()
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "There is an Internal Server Error", [
      error?.message,
    ])
  }
}

module.exports = usermiddle
