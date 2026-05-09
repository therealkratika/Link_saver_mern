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

        <p>Click below to verify your account:</p>

        <a href="${verificationLink}">
          Verify Email
        </a>
      `,
    });
};

module.exports = sendVerificationEmail;