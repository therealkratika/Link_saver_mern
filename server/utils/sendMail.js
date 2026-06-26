const sendVerificationEmail = async (email, token) => {
  const verificationLink =
    `${process.env.BASE_URL}/api/auth/verify/${token}`;

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>

        <p>Click the button below to verify your email:</p>

        <a href="${verificationLink}">
          Verify Email
        </a>
      `,
    });

    console.log("RESEND RESPONSE:", response);

    return response;
  } catch (error) {
    console.error("RESEND ERROR:", error);
    throw error;
  }
};