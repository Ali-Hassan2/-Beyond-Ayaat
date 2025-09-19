const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/send-response");

const adminmiddle = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return sendResponse(res, 400, false, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  console.log("The token is:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
    req.adminid = decoded.id;
    next();
  } catch (error) {
    console.log("Error in admin middleware:", error);
    return sendResponse(res, 401, false, "Invalid or expired token", null, [
      error.message,
    ]);
  }
};

module.exports = { adminmiddle };
