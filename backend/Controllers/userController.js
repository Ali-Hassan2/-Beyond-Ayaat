const User = require("../Models/user-model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
dotenv.config();

const userSignup = async (req, res) => {
  const first_name = req.body?.first_name;
  const last_name = req.body?.last_name;
  const email = req.body?.email;
  const password = req.body?.password;
  console.log("The data we got is:", first_name, last_name, email, password);

  const userValidation = z.object({
    first_name: z
      .string()
      .min(3, { message: "First name should be at least 3 chars" }),
    last_name: z.string().min(3, { message: "Lastname should be 3 chars" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password should be atleast 6 chars" }),
  });

  const useValidate = userValidation.safeParse(req.body);
  if (!userValidation) {
    return res.status(400).send({
      success: false,
      message: "Please validate your inputs",
      errors: useValidate.error.issue.map((err) => err.message),
    });
  }

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(401).send({
        success: false,
        message: "Uncomplete inputs",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedpassword,
    };

    const new_User = new User(payload);
    await new_User.save();
    return res.status(200).send({
      success: true,
      message: "User create successfully",
      user: new_User,
    });
  } catch (error) {
    console.log("There is an error bro,", error);
    return res.status(500).send({
      success: false,
      message: "There is an Internal Server error",
      error: error,
    });
  }
};

const userLogin = async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;
  console.log("The data we got is:", { email, password });

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Sorry uncomplete request",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const ispasswordmatch = await bcrypt.compare(password, user?.password);
    if (!ispasswordmatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user?._id?.toString() },
      process.env.JWT_PASSWORD,
      { expiresIn: "365d" }
    );

    const cookiesOptions = {
      expires: new Date(Date.now() + 24 * 60 * 100),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookiesOptions);
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
    });
  } catch (error) {
    console.log("There is an error while loging in the user", error);
    return res.status(500).json({
      success: false,
      messaage: "Error while login in Internal Server error",
      error: error?.message,
    });
  }
};

module.exports = { userLogin, userSignup };
