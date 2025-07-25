const Admin = require("../Models/admin-model");
const dotenv = require("dotenv");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
dotenv.config();

const adminSignup = async (req, res) => {
  const first_name = req.body?.first_name;
  const last_name = req.body?.last_name;
  const email = req.body?.email;
  const password = req.body?.password;

  const validation_data = z.object({
    first_name: z
      .string()
      .min(3, { message: "The first name should be 3 chars" }),
    last_name: z.string().min(3, {
      message: "The last name should be 3 chars.",
    }),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password should be atleast 6 chats long.",
    }),
  });

  const validation = validation_data.safeParse(req.body);
  if (!validation.success) {
    return res.status(402).send({
      success: false,
      message: "Please validate your inputs",
      errors: validation.error.issues.map((err) => err?.message),
    });
  }

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "Cannot create the admin. Input is Incomplete",
      });
    }
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      return res.status(400).json({
        message: "Admin already exist",
        admin: admin,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedpassword,
    };
    const new_Admin = new Admin(payload);
    new_Admin.save();
    return res.status(200).json({
      success: false,
      message: "Admin created Successfully",
      admin: new_Admin,
    });
  } catch (error) {
    console.log("There is an issue while creating the admin", error);
    return res.status(500).json({
      success: false,
      message: "There is an issue",
      error: error?.message,
    });
  }
};

const adminLogin = async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "There is an issue. Please complete the input",
      });
    }

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(401).send({
        success: false,
        message: "Admin not found",
      });
    }
    console.log("The password we got is:", password);
    const hashing = await bcrypt.hash(password, 10);
    console.log("The hasing is:", hashing);
    const ispassword_match = await bcrypt.compare(password, admin?.password);
    if (!ispassword_match) {
      return res.status(402).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin?._id?.toString(),
      },
      process.env.JWT_PASSWORD,
      {
        expiresIn: "365d",
      }
    );

    const cookiesOptions = {
      expires: new Date(Date.now() + 24 * 60 * 100),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookiesOptions);

    return res.status(200).send({
      success: false,
      message: "Login Successfull",
      admin: {
        _id: admin?._id,
        first_name: admin?.first_name,
        last_name: admin?.last_name,
        email: admin?.email,
        password: admin?.password,
      },
      token,
    });
  } catch (error) {
    console.log("There is an error while login the user in:", error);
    return res.status(500).send({
      success: false,
      message: "Login failrd",
      error: error?.message,
    });
  }
};

module.exports = { adminSignup, adminLogin };
