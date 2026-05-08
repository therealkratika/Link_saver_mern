const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  try {

    const verificationLink =
      `${process.env.BASE_URL}/api/auth/verify/${token}`;

    console.log("Sending email to:", email);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
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

    console.log("Mail sent:", info.response);

  } catch (err) {
    console.log("MAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendVerificationEmail;