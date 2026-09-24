import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    text: `You requested a password reset.

Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can ignore this email.`,
    html: `
      <h2>Reset your password</h2>

      <p>You requested a password reset for your account.</p>

      <p>
        <a href="${resetUrl}">
          Click here to reset your password
        </a>
      </p>

      <p>This link will expire in 15 minutes.</p>

      <p>If you did not request a password reset, you can ignore this email.</p>
    `,
  });
}