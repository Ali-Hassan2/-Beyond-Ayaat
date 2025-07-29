const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/send-response");

const adminmiddle = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return sendResponse(res, 400, false, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
    console.log("The decoded is:", decoded);
    req.adminid = decoded.id;
    next();
  } catch (error) {
    console.log("There is an error while checking middleware", error);
    sendResponse(res, 500, false, [error?.message]);
  }
};

module.exports = adminmiddle;
