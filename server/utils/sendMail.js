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
module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};