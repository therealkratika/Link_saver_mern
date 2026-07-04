const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../../utils/sendMail");
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

const signToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { name, email, password } = req.body;
  const sanitizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = signToken({ email: sanitizedEmail }, "1d");

    await User.create({
      name,
      email: sanitizedEmail,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await sendVerificationEmail(sanitizedEmail, verificationToken);

    return res.status(201).json({
      msg: "User registered. Please check your email to verify your account.",
    });
  } catch (err) {
    return res.status(500).json({ msg: "An internal server error occurred", error: err.message });
  }
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { email, password } = req.body;
  const sanitizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    const token = signToken({ id: user._id }, "7d");

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: "An internal server error occurred" ,error: err.message  });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        msg: "Token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    return res.json({
      msg: "Email verified successfully",
    });

  } catch (err) {
    return res.status(400).json({
      msg: "Invalid or expired token",
    });
  }
};
const resendVerification = async (req, res) => {
  const { error } = emailSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  try {
    const { email } = req.body;
    const sanitizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: sanitizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        msg: "Email is already verified",
      });
    }
    const verificationToken = signToken(
      { email: sanitizedEmail },
      "1d"
    );
    user.verificationToken = verificationToken;
    await user.save();
    await sendVerificationEmail(
      sanitizedEmail,
      verificationToken
    );

    return res.json({
      msg: "Verification email sent successfully",
    });

  } catch (err) {
    console.error("RESEND VERIFICATION ERROR:", err);

    return res.status(500).json({
      msg: "Failed to resend verification email",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { error } = emailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const { email } = req.body;
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: sanitizedEmail });
    if (user) {
      const resetToken = signToken({ id: user._id }, "1h");
      await sendResetPasswordEmail(user.email, resetToken);
    }

    return res.json({ msg: "If an account exists with that email, a reset link has been sent." });
  } catch (err) {
    return res.status(500).json({ msg: "An internal server error occurred", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.json({ msg: "Password reset successful" });
  } catch (err) {
    return res.status(400).json({ msg: "Invalid or expired token", error: err.message });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification

};