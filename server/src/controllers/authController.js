const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../../utils/sendMail");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

const signup = async (req, res) => {

  console.log("SIGNUP ROUTE HIT");

  const { error } = signupSchema.validate(req.body);

  if (error) {
    console.log("VALIDATION ERROR:", error.message);

    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  const { name, email, password } = req.body;

  try {

    const sanitizedEmail =
      email.trim().toLowerCase();

    console.log("Checking existing user");

    const existingUser = await User.findOne({
      email: sanitizedEmail,
    });

    if (existingUser) {

      console.log("USER ALREADY EXISTS");

      return res.status(400).json({
        msg: "User already exists",
      });
    }

    console.log("Hashing password");

    const hashedPassword =
      await bcrypt.hash(password, 10);

    console.log("Creating token");

    const verificationToken = jwt.sign(
      { email: sanitizedEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Creating user");

    await User.create({
      name,
      email: sanitizedEmail,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    console.log("BEFORE MAIL");

    await sendVerificationEmail(
      sanitizedEmail,
      verificationToken
    );

    console.log("AFTER MAIL");

    res.json({
      msg: "User registered. Verification email sent.",
    });

  } catch (err) {

    console.log("SIGNUP ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  try {
    const sanitizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: sanitizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        msg: "Please verify your email first",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({
      msg: "Email verified successfully",
    });

  } catch (err) {
    res.status(400).json({
      msg: "Invalid or expired token",
    });
  }
};
const forgotPassword = async (req, res) => {
  try{
      const { email } = req.body;
      const user = await User.findOne({ email: email.trim().toLowerCase() });

      if (!user) {
          return res.status(404).json({ msg: "User not found" });
      }

      const resetToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );
      await sendResetPasswordEmail(user.email, resetToken);

      res.json({ msg: "Password reset email sent" });

  }catch(err){
      res.status(500).json({ error: err.message });
  }
}
const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      msg: "Password reset successful",
    });

  } catch (err) {

    res.status(400).json({
      msg: "Invalid or expired token",
    });
  }
};
module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
};