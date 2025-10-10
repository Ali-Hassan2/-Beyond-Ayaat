const { google } = require("googleapis")
const dotenv = require("dotenv")
dotenv.config()
const REDIRECT_URL = process.env.REDIRECT_URL
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URL
)

module.exports = oauth2Client
