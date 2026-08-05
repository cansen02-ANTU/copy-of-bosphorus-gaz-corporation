import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

/**
 * Nodemailer + Gmail SMTP notification system.
 *
 * Required env vars:
 *   SMTP_USER     – Gmail address (e.g. yourname@gmail.com)
 *   SMTP_PASSWORD – Gmail App Password (16-char code from Google Account → Security → App Passwords)
 *   NOTIFICATION_EMAIL – Where to send notifications (e.g. information@bosphorusgaz.com)
 *
 * Gmail App Password setup:
 *   1. Enable 2-Step Verification on your Google Account
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Create an app password for "Mail" → copy the 16-character code
 */

function createTransporter() {
  if (!ENV.smtpUser || !ENV.smtpPassword) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPassword,
    },
  });
}

/**
 * Send a notification email when a form is submitted.
 * Returns true if sent successfully, false if skipped or failed.
 * Never throws — callers don't need try/catch.
 */
export async function sendNotificationEmail(
  subject: string,
  body: string
): Promise<boolean> {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("[Email] SMTP not configured (SMTP_USER/SMTP_PASSWORD missing), skipping notification");
    return false;
  }

  const to = ENV.notificationEmail || ENV.smtpUser;

  try {
    await transporter.sendMail({
      from: `"Bosphorus Gaz Web" <${ENV.smtpUser}>`,
      to,
      subject,
      text: body,
    });
    console.log(`[Email] Notification sent: "${subject}" → ${to}`);
    return true;
  } catch (err) {
    console.warn("[Email] Failed to send notification:", err);
    return false;
  }
}
