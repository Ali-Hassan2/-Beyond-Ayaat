const Admin = require("../Models/admin-model");
const dotenv = require("dotenv");
const adminvalidationSchema = require("../Validations/admin.validation");
const sendResponse = require("../Utils/send-response"); // 👈 Fixed import
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
dotenv.config();

const adminSignup = async (req, res) => {
  const first_name = req.body?.first_name;
  const last_name = req.body?.last_name;
  const email = req.body?.email;
  const password = req.body?.password;
  const validation = adminvalidationSchema.safeParse(req.body);
  if (!validation.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate your inputs",
      null,
      validation.error.issues.map((err) => err?.message)
    );
  }

  try {
    if (!first_name || !last_name || !email || !password) {
      return sendResponse(res, 400, false, "Incomplete input");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return sendResponse(res, 400, false, "Admin already exists", {
        admin: existingAdmin,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = { first_name, last_name, email, password: hashedPassword };
    const newAdmin = await Admin.create(payload);

    return sendResponse(res, 201, true, "Admin created successfully", {
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return sendResponse(res, 500, false, "Internal server error", null, [
      error.message,
    ]);
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return sendResponse(res, 401, false, "Admin not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_PASSWORD,
      {
        expiresIn: "365d",
      }
    );

    const cookiesOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookiesOptions);

    return sendResponse(res, 200, true, "Login successful", {
      admin: {
        _id: admin?._id,
        first_name: admin?.first_name,
        last_name: admin?.last_name,
        email: admin?.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendResponse(res, 500, false, "Login failed", null, [error.message]);
  }
};

module.exports = { adminSignup, adminLogin };
