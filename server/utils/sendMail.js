const axios = require("axios");

const sendViaBrevo = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "LinkSaver",
          email: "therealkratikagupta@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("========== BREVO ==========");
    console.log("TO:", to);
    console.log("MESSAGE:", response.data);
    console.log("===========================");

    return response.data;
  } catch (error) {
    console.error(
      "BREVO EMAIL ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ===============================
// Verification Email
// ===============================
const sendVerificationEmail = async (email, token) => {
  const verificationLink =
    `${process.env.BASE_URL}/api/auth/verify/${token}`;

  return sendViaBrevo({
    to: email,
    subject: "Verify Your LinkSaver Account",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8fafc;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
        ">
          <h2 style="color: #111827;">
            Verify Your Email
          </h2>

          <p style="color: #4b5563;">
            Welcome to LinkSaver!
          </p>

          <p style="color: #4b5563;">
            Please verify your email address by clicking the button below.
          </p>

          <a
            href="${verificationLink}"
            style="
              display: inline-block;
              margin-top: 15px;
              padding: 12px 24px;
              background: #10b981;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Verify Email
          </a>

          <p style="
            margin-top: 25px;
            color: #6b7280;
            font-size: 13px;
          ">
            This verification link will expire in 24 hours.
          </p>
        </div>
      </div>
    `,
  });
};


// ===============================
// Reset Password Email
// ===============================
const sendResetPasswordEmail = async (email, token) => {
  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;

  return sendViaBrevo({
    to: email,
    subject: "Reset Your LinkSaver Password",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8fafc;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
        ">
          <h2 style="color: #111827;">
            Reset Your Password
          </h2>

          <p style="color: #4b5563;">
            We received a request to reset your LinkSaver password.
          </p>

          <p style="color: #4b5563;">
            Click the button below to create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              margin-top: 15px;
              padding: 12px 24px;
              background: #10b981;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>

          <p style="
            margin-top: 25px;
            color: #6b7280;
            font-size: 13px;
          ">
            This link will expire in 1 hour.
          </p>

          <p style="
            margin-top: 15px;
            color: #6b7280;
            font-size: 13px;
          ">
            If you didn't request a password reset, you can safely ignore
            this email.
          </p>
        </div>
      </div>
    `,
  });
};
module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};