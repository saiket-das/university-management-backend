import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (userEmail: string, resetUrl: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'prodction', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_pass,
    },
  });

  const info = await transporter.sendMail({
    from: config.nodemailer_email, // sender address
    to: userEmail, // list of receivers
    subject: 'Password reset request', // Subject line
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Please click the link below to set a new password:</p>
      <p><a href="${resetUrl}" style="color: #1a73e8;">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
      <p>Thank you,</p>
      <p>Your Company Team</p>
    </div>
  `,
  });
};
