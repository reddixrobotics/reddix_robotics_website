import { Injectable, Logger } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    let user = process.env.SMTP_USER;
    let pass = process.env.SMTP_PASS;
    let host = process.env.SMTP_HOST || 'smtp.ethereal.email';
    let port = parseInt(process.env.SMTP_PORT || '587', 10);
    let secure = process.env.SMTP_SECURE === 'true';

    // Auto-generate test account if none provided and using ethereal
    if (!user && host === 'smtp.ethereal.email') {
      this.logger.log('No SMTP_USER found. Creating a temporary Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      user = testAccount.user;
      pass = testAccount.pass;
      host = testAccount.smtp.host;
      port = testAccount.smtp.port;
      secure = testAccount.smtp.secure;
      this.logger.log(`Created Ethereal test account: ${user}`);
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Send mail using Nodemailer.
   */
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    try {
      if (!this.transporter) {
        // Wait for initTransporter to finish if called immediately
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const from = process.env.EMAIL_FROM || '"Reddix Robotics" <noreply@reddixrobotics.com>';
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text: body, // plain text body
      });
      
      this.logger.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      
      // Log Ethereal preview URL if using ethereal email
      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send password reset request email.
   */
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request - Reddix Robotics';
    const body = `Hello,

We received a request to reset your password. You can reset it by clicking the link below:

${resetLink}

This link is valid for a limited time. If you did not request a password reset, please ignore this email or contact support.

Best regards,
Reddix Robotics Security Team`;

    await this.sendMail(email, subject, body);
  }

  /**
   * Send a login alert email for security notification.
   */
  async sendLoginAlert(email: string, ipAddress: string, userAgent: string): Promise<void> {
    const subject = 'Security Alert: New Login Detected - Reddix Robotics';
    const body = `Hello,

A new login was detected for your account.

Details:
- Email: ${email}
- IP Address: ${ipAddress || 'Unknown'}
- User Agent: ${userAgent || 'Unknown'}
- Time: ${new Date().toISOString()}

If this login was authorized, no action is needed. If you do not recognize this activity, please change your password immediately.

Best regards,
Reddix Robotics Security Team`;

    await this.sendMail(email, subject, body);
  }

  /**
   * Send 6-digit OTP for Email verification step.
   */
  async sendEmailOtp(email: string, otp: string): Promise<void> {
    const subject = 'Your Admin Login Verification Code - Reddix Robotics';
    const body = `Hello,

Your verification code is: ${otp}

This code will expire in 5 minutes. If you did not attempt to log in, please secure your account immediately.

Best regards,
Reddix Robotics Security Team`;

    await this.sendMail(email, subject, body);
  }

  /**
   * Send 2FA status change notification.
   */
  async sendTwoFactorStatusShift(email: string, enabled: boolean): Promise<void> {
    const status = enabled ? 'ENABLED' : 'DISABLED';
    const subject = `Security Update: 2FA ${status} - Reddix Robotics`;
    const body = `Hello,

Two-Factor Authentication (2FA) has been successfully ${status} for your account.

If you did not perform this action, please contact support and secure your account immediately.

Best regards,
Reddix Robotics Security Team`;

    await this.sendMail(email, subject, body);
  }
}
