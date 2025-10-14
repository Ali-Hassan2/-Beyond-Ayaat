const Admin = require("../Models/admin-model")
const dotenv = require("dotenv")
const adminvalidationSchema = require("../Validations/admin.validation")
const sendResponse = require("../helpers/send-response")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { fa } = require("zod/v4/locales")
dotenv.config()

const adminSignup = async (req, res) => {
  const first_name = req.body?.first_name
  const last_name = req.body?.last_name
  const email = req.body?.email
  const password = req.body?.password
  const validation = adminvalidationSchema.safeParse(req.body)
  if (!validation.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate your inputs",
      null,
      validation.error.issues.map((err) => err?.message)
    )
  }
  try {
    if (!first_name || !last_name || !email || !password) {
      return sendResponse(res, 400, false, "Incomplete input")
    }

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return sendResponse(res, 400, false, "Admin already exists", {
        admin: existingAdmin,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const payload = { first_name, last_name, email, password: hashedPassword }
    const newAdmin = await Admin.create(payload)

    return sendResponse(res, 201, true, "Admin created successfully", {
      admin: newAdmin,
    })
  } catch (error) {
    console.error("Admin creation error:", error)
    return sendResponse(res, 500, false, "Internal server error", null, [
      error.message,
    ])
  }
}

const adminLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required")
    }
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return sendResponse(res, 401, false, "Admin not found")
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials")
    }

    const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_ADMIN_PASSWORD,
      {
        expiresIn: "365d",
      }
    )

    const cookiesOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    }

    res.cookie("jwt", token, cookiesOptions)

    return sendResponse(res, 200, true, "Login successful", {
      admin: {
        _id: admin?._id,
        first_name: admin?.first_name,
        last_name: admin?.last_name,
        email: admin?.email,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return sendResponse(res, 500, false, "Login failed", null, [error.message])
  }
}

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
      message: "Logout successfully",
    })
  } catch (error) {
    console.log("There is an issue: ", error)
    return res.status(500).send({
      success: false,
      message: "Internal Server error",
      error: error,
    })
  }
}
const getadmins = async (req, res) => {
  const adminid = req.adminid
  if (!adminid) {
    return res.status(404).send({
      success: false,
      message: "Only admins can create new admins",
    })
  }

  try {
    const admins = await Admin.find(
      {},
      { first_name: 1, last_name: 1, email: 1, password: 1 }
    )

    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins,
    })
  } catch (error) {
    console.log("There is an error,", error)
    return sendResponse(res, 500, false, "There is an error.", error?.message)
  }
}

const deleteadmin = async (req, res) => {
  const adminid = req.adminid
  if (!adminid) {
    return sendResponse(res, 404, false, "Only admin can delete another admin.")
  }
  const { id } = req.params
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "There is no id provided",
    })
  }
  console.log("The id is:", id)
  try {
    const deleted = await Admin.findByIdAndDelete(id)
    if (!deleted) {
      return sendResponse(res, 404, false, "No admin with this id founded.")
    }
    return res.status(200).json({
      success: true,
      message: "Admin delete successfully.",
    })
  } catch (error) {
    console.log("There is an error.", error)
    return sendResponse(res, 505, false, "Internal Server Error", null, [
      error?.message,
    ])
  }
}

const updateadmin = async (req, res) => {
  const adminid = req.adminid
  if (!adminid) {
    return res.status(404).json({
      success: false,
      message: "Only admin have access to change admin info.",
    })
  }
  try {
    const { id } = req.params
    const { first_name, last_name, email, password } = req.body
    if (!id || !first_name || !last_name || !password) {
      return res.status(304).send({
        success: false,
        message: "Please complete the input",
      })
    }
    const finded = await Admin.findById(id)
    if (!finded) {
      return sendResponse(res, 404, false, "No admin with this id.")
    }

    const isSame =
      finded?.first_name === first_name &&
      finded?.last_name === last_name &&
      finded?.email === email &&
      (!password || (await bcrypt.compare(password, finded.password)))
    if (isSame) {
      return res.status(404).json({
        success: false,
        message: "Please do some change to update admin info",
      })
    }
    let hashedPassword = finded.password
    if (password && !(await bcrypt.compare(password, finded.password))) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const payload = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    }
    if (email) {
      payload.email = email
    }
    const updated_one = await Admin.findByIdAndUpdate(id, payload, {
      new: true,
    })
    return sendResponse(
      res,
      200,
      true,
      "Admin updated successfully",
      updated_one
    )
  } catch (error) {
    console.log("There is an error.", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    })
  }
}

module.exports = {
  adminSignup,
  adminLogin,
  logout,
  getadmins,
  deleteadmin,
  updateadmin,
}
