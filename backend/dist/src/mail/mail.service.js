"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
let MailService = MailService_1 = class MailService {
    logger = new common_1.Logger(MailService_1.name);
    async sendMail(to, subject, body) {
        this.logger.log(`========================================`);
        this.logger.log(`[MAIL SEND STUB]`);
        this.logger.log(`To: ${to}`);
        this.logger.log(`Subject: ${subject}`);
        this.logger.log(`Body:\n${body}`);
        this.logger.log(`========================================`);
    }
    async sendPasswordResetEmail(email, resetLink) {
        const subject = 'Password Reset Request - Reddix Robotics';
        const body = `Hello,

We received a request to reset your password. You can reset it by clicking the link below:

${resetLink}

This link is valid for a limited time. If you did not request a password reset, please ignore this email or contact support.

Best regards,
Reddix Robotics Security Team`;
        await this.sendMail(email, subject, body);
    }
    async sendLoginAlert(email, ipAddress, userAgent) {
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
    async sendTwoFactorStatusShift(email, enabled) {
        const status = enabled ? 'ENABLED' : 'DISABLED';
        const subject = `Security Update: 2FA ${status} - Reddix Robotics`;
        const body = `Hello,

Two-Factor Authentication (2FA) has been successfully ${status} for your account.

If you did not perform this action, please contact support and secure your account immediately.

Best regards,
Reddix Robotics Security Team`;
        await this.sendMail(email, subject, body);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)()
], MailService);
//# sourceMappingURL=mail.service.js.map