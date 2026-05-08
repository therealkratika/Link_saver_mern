const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../../utils/sendMail");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });
    await sendVerificationEmail(email, verificationToken);

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
  const { email, password } = req.body;

  try {
    if (
  !email ||
  typeof email !== "string"
) {
  return res.status(400).json({
    msg: "Invalid email"
  });
}

const sanitizedEmail =
  email.trim().toLowerCase();

const user = await User.findOne({
  email: sanitizedEmail
});
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
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
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
module.exports = { signup, login, verifyEmail };