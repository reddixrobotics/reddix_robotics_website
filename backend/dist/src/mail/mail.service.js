"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    logger = new common_1.Logger(MailService_1.name);
    transporter;
    constructor() {
        this.initTransporter();
    }
    async initTransporter() {
        let user = process.env.SMTP_USER;
        let pass = process.env.SMTP_PASS;
        let host = process.env.SMTP_HOST || 'smtp.ethereal.email';
        let port = parseInt(process.env.SMTP_PORT || '587', 10);
        let secure = process.env.SMTP_SECURE === 'true';
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
    async sendMail(to, subject, body) {
        try {
            if (!this.transporter) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            const from = process.env.EMAIL_FROM || '"Reddix Robotics" <noreply@reddixrobotics.com>';
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                text: body,
            });
            this.logger.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
            if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
                this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
        }
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
    async sendEmailOtp(email, otp) {
        const subject = 'Your Admin Login Verification Code - Reddix Robotics';
        const body = `Hello,

Your verification code is: ${otp}

This code will expire in 5 minutes. If you did not attempt to log in, please secure your account immediately.

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
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map