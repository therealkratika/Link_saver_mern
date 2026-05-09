const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendVerificationEmail =
  async (email, token) => {

    const verificationLink =
      `${process.env.BASE_URL}/api/auth/verify/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email",

      html: `
        <h2>Email Verification</h2>

        <a href="${verificationLink}">
          Verify Email
        </a>
      `,
    });
};

const sendResetPasswordEmail =
  async (email, token) => {

    const resetLink =
      `https://link-saver-mern-914j.onrender.com/reset-password/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",

      html: `
        <h2>Password Reset</h2>

        <p>Click below to reset password:</p>

        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};