import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  /**
   * Generic mail sender (stubbed to console log).
   */
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log(`========================================`);
    this.logger.log(`[MAIL SEND STUB]`);
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Body:\n${body}`);
    this.logger.log(`========================================`);
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
