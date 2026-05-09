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

    console.log("EMAIL USER:", process.env.EMAIL_USER);
    console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);

    const verificationLink =
      `${process.env.BASE_URL}/api/auth/verify/${token}`;

    console.log("Verification Link:", verificationLink);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>

        <p>Click below to verify:</p>

        <a href="${verificationLink}">
          Verify Email
        </a>
      `,
    });

    console.log("MAIL SENT:", info);

  } catch (err) {

    console.log("MAIL ERROR:", err);

    throw err;
  }
};

module.exports = sendVerificationEmail;