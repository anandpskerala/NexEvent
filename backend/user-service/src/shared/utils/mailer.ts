import nodemailer from "nodemailer";
import { config } from "../../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: config.mail.host,
  port: 465,
  secure: true,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass
  }
})

export const sendOtpMail = async (email: string, otp: number) => {
  const mailOptions = {
    from: config.mail.user,
    to: email,
    subject: "🔐 Your OTP for NexEvent",
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #4a4a4a;">NexEvent Verification</h2>
          <p style="font-size: 16px; color: #333;">
            Hello 👋,
          </p>
          <p style="font-size: 16px; color: #333;">
            Use the following One-Time Password (OTP) to complete your verification:
          </p>
          <div style="margin: 30px auto; text-align: center;">
            <span style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">
            This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
            © ${new Date().getFullYear()} NexEvent. All rights reserved.
          </p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordMail = async (email: string, resetToken: string) => {
  const resetLink = `${config.app.frontendUrl}/reset-password/${resetToken}`;
  console.log(resetLink)

  const mailOptions = {
    from: config.mail.user,
    to: email,
    subject: "🔐 Reset Your NexEvent Password",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4a4a4a;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #333;">
          Hello 👋,
        </p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your NexEvent account password. Click the button below to set a new one:
        </p>
        <div style="margin: 30px auto; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; font-size: 16px; font-weight: bold; border-radius: 8px; text-decoration: none;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you didn't request this, you can safely ignore this email. This link will expire in <strong>15 minutes</strong>.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
          © ${new Date().getFullYear()} NexEvent. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrganizerApprovalMail = async (email: string, firstName: string) => {
  const dashboardLink = `${config.app.frontendUrl}/organizer/dashboard`;

  const mailOptions = {
    from: config.mail.user,
    to: email,
    subject: "✅ Your Organizer Request Has Been Approved!",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4a4a4a;">Welcome to NexEvent Organizer Panel 🎉</h2>
        <p style="font-size: 16px; color: #333;">
          Hello ${firstName || "there"}, 👋
        </p>
        <p style="font-size: 16px; color: #333;">
          We're excited to inform you that your request to become an organizer on <strong>NexEvent</strong> has been approved!
        </p>
        <p style="font-size: 16px; color: #333;">
          You can now create and manage events, track ticket sales, and more from your organizer dashboard.
        </p>
        <div style="margin: 30px auto; text-align: center;">
          <a href="${dashboardLink}" style="display: inline-block; background-color: #28a745; color: white; padding: 15px 30px; font-size: 16px; font-weight: bold; border-radius: 8px; text-decoration: none;">
            Go to Dashboard
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you have any questions, feel free to reach out to our support team. We're here to help.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
          © ${new Date().getFullYear()} NexEvent. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrganizerRejectionMail = async (email: string, firstName: string) => {
  const supportLink = `${config.app.frontendUrl}/account/request-organizer-form`;

  const mailOptions = {
    from: config.mail.user,
    to: email,
    subject: "⚠️ Your Organizer Request Has Been Rejected",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #d9534f;">Organizer Request Rejected</h2>
        <p style="font-size: 16px; color: #333;">
          Hello ${firstName || "there"}, 👋
        </p>
        <p style="font-size: 16px; color: #333;">
          We appreciate your interest in becoming an organizer on <strong>NexEvent</strong>. After reviewing your request, we regret to inform you that it has not been approved at this time.
        </p>
        <p style="font-size: 16px; color: #333;">
          This could be due to missing or insufficient details in your submission. You are welcome to update your profile and try again in the future.
        </p>
        <div style="margin: 30px auto; text-align: center;">
          <a href="${supportLink}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 25px; font-size: 15px; font-weight: bold; border-radius: 8px; text-decoration: none;">
            Re-Apply again
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          If you believe this was a mistake or would like to understand the decision better, feel free to reach out to our team.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
          © ${new Date().getFullYear()} NexEvent. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};