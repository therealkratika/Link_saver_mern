const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const verificationLink =
    `${process.env.BASE_URL}/api/auth/verify/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>

        <p>Please verify your email by clicking the button below:</p>

        <p>
          <a href="${verificationLink}">
            Verify Email
          </a>
        </p>
      `,
    });

    console.log("========== RESEND ==========");
    console.log("TO:", email);
    console.log("DATA:", data);
    console.log("ERROR:", error);
    console.log("============================");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("VERIFICATION EMAIL ERROR:", error);
    throw error;
  }
};


const sendResetPasswordEmail = async (email, token) => {
  // Change this to your frontend URL if needed
  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to choose a new password:
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #3D281D;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 1 hour.
        </p>

        <p>
          If you didn't request a password reset, you can safely ignore
          this email.
        </p>
      `,
    });

    console.log("========== PASSWORD RESET ==========");
    console.log("TO:", email);
    console.log("DATA:", data);
    console.log("ERROR:", error);
    console.log("====================================");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("RESET PASSWORD EMAIL ERROR:", error);
    throw error;
  }
};


module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};