const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink =
    `${process.env.BASE_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
};

module.exports = sendVerificationEmail;