const nodemailer = require("nodemailer");

const sendResetEmail = async (email, token) => {
  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Only use this in development
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    const mailOptions = {
      from: {
        name: "CryCare Support",
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: "Password Reset Request - CryCare",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p style="color: #666;">Hello,</p>
            <p style="color: #666;">We received a request to reset your password for your CryCare account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666;">If you didn't request this password reset, you can safely ignore this email.</p>
            <p style="color: #666;">This link will expire in 1 hour for security reasons.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              If the button above doesn't work, copy and paste this link into your browser:<br>
              ${resetLink}
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    if (error.code === 'EAUTH') {
      throw new Error("Email authentication failed. Please check your email credentials.");
    } else if (error.code === 'ESOCKET') {
      throw new Error("Network error while sending email. Please check your internet connection.");
    } else {
      throw new Error(`Failed to send reset password email: ${error.message}`);
    }
  }
};

module.exports = sendResetEmail;
