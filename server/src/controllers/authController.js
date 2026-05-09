const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const sendVerificationEmail = require("../../utils/sendMail");

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
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  const { name, email, password } = req.body;

  try {
    const sanitizedEmail =
      email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: sanitizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { email: sanitizedEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await User.create({
      name,
      email: sanitizedEmail,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await sendVerificationEmail(
      sanitizedEmail,
      verificationToken
    );

    res.json({
      msg: "User registered. Verification email sent.",
    });

  } catch (err) {
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

module.exports = {
  signup,
  login,
  verifyEmail,
};