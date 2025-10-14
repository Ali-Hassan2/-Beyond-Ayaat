const User = require("../Models/user-model")
const dotenv = require("dotenv")
const axios = require("axios")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const oauth2Client = require("../helpers/googleapiConfig")
const z = require("zod")
const sendResponse = require("../helpers/send-response")
dotenv.config()

const userSignup = async (req, res) => {
  const first_name = req.body?.first_name
  const last_name = req.body?.last_name
  const email = req.body?.email
  const password = req.body?.password
  console.log("The data we got is:", first_name, last_name, email, password)

  const userValidation = z.object({
    first_name: z
      .string()
      .min(3, { message: "First name should be at least 3 chars" }),
    last_name: z.string().min(3, { message: "Lastname should be 3 chars" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password should be atleast 6 chars" }),
  })

  const useValidate = userValidation.safeParse(req.body)
  if (!userValidation) {
    return res.status(400).send({
      success: false,
      message: "Please validate your inputs",
      errors: useValidate.error.issue.map((err) => err.message),
    })
  }

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(401).send({
        success: false,
        message: "Uncomplete inputs",
      })
    }
    const user = await User.findOne({ email: email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      })
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedpassword,
    }

    const new_User = new User(payload)
    await new_User.save()
    return res.status(200).send({
      success: true,
      message: "User create successfully",
      user: new_User,
    })
  } catch (error) {
    console.log("There is an error bro,", error)
    return res.status(500).send({
      success: false,
      message: "There is an Internal Server error",
      error: error,
    })
  }
}

const userLogin = async (req, res) => {
  const email = req.body?.email
  const password = req.body?.password
  console.log("The data we got is:", { email, password })

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Sorry uncomplete request",
      })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    const ispasswordmatch = await bcrypt.compare(password, user?.password)
    if (!ispasswordmatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      { id: user?._id?.toString() },
      process.env.JWT_PASSWORD,
      { expiresIn: "365d" }
    )

    const cookiesOptions = {
      expires: new Date(Date.now() + 24 * 60 * 100),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    }
    res.cookie("jwt", token, cookiesOptions)
    return res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user?._id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
      },
      token,
    })
  } catch (error) {
    console.log("There is an error while loging in the user", error)
    return res.status(500).json({
      success: false,
      messaage: "Error while login in Internal Server error",
      error: error?.message,
    })
  }
}
const greet = async (req, res) => {}

const logout = async (req, res) => {
  try {
    if (!req.cookie.jwt) {
      return res.status(400).json({
        success: false,
        message: "Please login first.",
      })
    }
    res.clearCookie("jwt")
    return res.status(200).send({
      success: false,
      message: "Logout successfully.",
    })
  } catch (error) {
    console.log("There is an error:", error)
    return res.status(505).send({
      success: false,
      message: "Internal Server Error.",
      error: error?.message,
    })
  }
}

const googlelogin = async (req, res) => {
  try {
    const code = req.body?.code

    if (!code) {
      return sendResponse(res, 400, false, "Authorization code is missing")
    }

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    )

    const { email, name, picture } = userRes.data

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ email, name, picture })
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_PASSWORD, {
      expiresIn: "365d",
    })

    return sendResponse(res, 200, true, "Logged in successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      token,
    })
  } catch (error) {
    console.error("Google Login Error:", error.message)
    return sendResponse(res, 500, false, "Google login failed", error.message)
  }
}

const saveBlog = async (req, res) => {
  try {
    const { blog_id } = req.query
    const { id: user_id } = req.userid
    if (!user_id) {
      return sendResponse(
        res,
        400,
        false,
        "Only Authenticated users can use this feature."
      )
    }
    const user = await User.findById(user_id)
    if (!user) {
      return sendResponse(res, 400, false, "User not found.")
    }
    if (user.savedBlogs.includes(blog_id)) {
      return sendResponse(res, 400, false, "Blog already saved")
    }
    user.savedBlogs.push(blog_id)
    await user.save()
    return sendResponse(res, 200, true, "Blog saved successfully")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "There is an error", [error?.message])
  }
}

const getSavedBlogs = async (req, res) => {
  try {
    const { id: user_id } = req.userid
    if (!user_id) {
      return sendResponse(res, 400, false, "Login First.")
    }
    const user = await User.findById(user_id).populate("savedBlogs")
    if (!user) {
      return sendResponse(res, 400, false, "User not found.")
    }

    return sendResponse(
      res,
      200,
      true,
      "Saved Blogs reterived successfully",
      user.savedBlogs
    )
  } catch (error) {
    console.log("There is an error ", eroor)
    return sendResponse(res, 500, false, "There is an error", [error?.message])
  }
}

const getAllUsers = async (req, res) => {
  const adminid = req.adminid
  if (!adminid) {
    return sendResponse(res, 400, false, "You are no one to get this facility.")
  }
  try {
    const all_users = await User.find(
      {},
      { _id: 1, first_name: 1, last_name: 1 }
    )
    return sendResponse(
      res,
      200,
      true,
      "User reterived successfully",
      all_users
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Servere Error", [
      error?.message,
    ])
  }
}

module.exports = {
  userLogin,
  userSignup,
  googlelogin,
  logout,
  saveBlog,
  getSavedBlogs,
  getAllUsers,
}
