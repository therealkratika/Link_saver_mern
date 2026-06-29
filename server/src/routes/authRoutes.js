const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify/:token", verifyEmail);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);
router.post("/resend-verification", resendVerification);
module.exports = router;