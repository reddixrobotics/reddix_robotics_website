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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_service_1 = require("../crypto/crypto.service");
const session_service_1 = require("./session.service");
const user_session_service_1 = require("./user-session.service");
const mail_service_1 = require("../mail/mail.service");
const redis_service_1 = require("../redis/redis.service");
const otplib_1 = require("otplib");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    cryptoService;
    sessionService;
    userSessionService;
    mailService;
    redis;
    constructor(prisma, cryptoService, sessionService, userSessionService, mailService, redis) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
        this.sessionService = sessionService;
        this.userSessionService = userSessionService;
        this.mailService = mailService;
        this.redis = redis;
    }
    async signup(name, email, plainTextPass, phone) {
        const existingAdmin = await this.prisma.admin.findUnique({ where: { email } });
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingAdmin || existingUser) {
            throw new common_1.ConflictException('An account with this email already exists.');
        }
        const passwordHash = await this.cryptoService.hashPassword(plainTextPass);
        await this.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                phone,
            },
        });
        return { message: 'Account created successfully.' };
    }
    async login(email, plainTextPass, ipAddress, userAgent) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (admin) {
            const passwordValid = await this.cryptoService.verifyPassword(admin.passwordHash, plainTextPass);
            if (!passwordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.redis.set(`email_otp:${admin.id}`, otp, 300);
            await this.mailService.sendEmailOtp(admin.email, otp);
            const { token, session } = await this.sessionService.createSession(admin.id, admin.role, 'PENDING_EMAIL_OTP', ipAddress, userAgent);
            return {
                requireEmailOtp: true,
                isTwoFactorSetup: admin.twoFactorEnabled,
                token,
                session,
                role: admin.role,
            };
        }
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            const passwordValid = await this.cryptoService.verifyPassword(user.passwordHash, plainTextPass);
            if (!passwordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const { token, session } = await this.userSessionService.createSession(user.id, user.role, ipAddress, userAgent);
            return {
                requireEmailOtp: false,
                token,
                session,
                role: user.role,
            };
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async verifyEmailOtp(token, otp) {
        const session = await this.sessionService.verifySession(token);
        if (!session || session.authStatus !== 'PENDING_EMAIL_OTP') {
            throw new common_1.UnauthorizedException('Invalid or expired session for email verification');
        }
        const cachedOtp = await this.redis.get(`email_otp:${session.adminId}`);
        if (!cachedOtp || cachedOtp !== otp) {
            throw new common_1.UnauthorizedException('Invalid or expired verification code');
        }
        await this.redis.del(`email_otp:${session.adminId}`);
        const updatedSession = await this.sessionService.updateSession(token, {
            authStatus: 'PENDING_AUTHENTICATOR',
        });
        if (!updatedSession) {
            throw new common_1.UnauthorizedException('Failed to update session');
        }
        return updatedSession;
    }
    async resendEmailOtp(token) {
        const session = await this.sessionService.verifySession(token);
        if (!session || session.authStatus !== 'PENDING_EMAIL_OTP') {
            throw new common_1.UnauthorizedException('Invalid or expired session');
        }
        const admin = await this.prisma.admin.findUnique({
            where: { id: session.adminId },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid admin');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redis.set(`email_otp:${admin.id}`, otp, 300);
        await this.mailService.sendEmailOtp(admin.email, otp);
    }
    async verify2fa(token, totpCode, ipAddress, userAgent) {
        const session = await this.sessionService.verifySession(token);
        if (!session || session.authStatus !== 'PENDING_AUTHENTICATOR') {
            throw new common_1.UnauthorizedException('Invalid or inactive 2FA session');
        }
        const admin = await this.prisma.admin.findUnique({
            where: { id: session.adminId },
        });
        if (!admin || !admin.twoFactorSecretEncrypted) {
            throw new common_1.UnauthorizedException('2FA is not set up for this administrator');
        }
        const secret = this.cryptoService.decrypt(admin.twoFactorSecretEncrypted);
        const verifyResult = await (0, otplib_1.verify)({
            token: totpCode,
            secret,
        });
        const isTokenValid = verifyResult.valid;
        if (!isTokenValid) {
            throw new common_1.UnauthorizedException('Invalid authenticator code');
        }
        const updatedSession = await this.sessionService.updateSession(token, {
            authStatus: 'AUTHENTICATED',
        });
        if (!updatedSession) {
            throw new common_1.UnauthorizedException('Failed to update session');
        }
        await this.mailService.sendLoginAlert(admin.email, ipAddress || 'Unknown', userAgent || 'Unknown');
        return updatedSession;
    }
    async logout(token) {
        await this.sessionService.invalidateSession(token);
    }
    async logoutUser(token) {
        await this.userSessionService.invalidateSession(token);
    }
    async forgotPassword(email) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            return { message: 'If the email matches an administrator, a password reset link has been sent.' };
        }
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: {
                adminId: admin.id,
                tokenHash,
                expiresAt,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/admin/reset-password?token=${token}`;
        await this.mailService.sendPasswordResetEmail(admin.email, resetLink);
        return { message: 'If the email matches an administrator, a password reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { admin: true },
        });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired password reset token');
        }
        const passwordHash = await this.cryptoService.hashPassword(newPassword);
        await this.prisma.$transaction([
            this.prisma.admin.update({
                where: { id: resetToken.adminId },
                data: { passwordHash },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);
        await this.sessionService.invalidateAllSessions(resetToken.adminId);
        await this.mailService.sendMail(resetToken.admin.email, 'Security Alert: Password Changed - Reddix Robotics', `Hello,\n\nThe password for your administrator account was successfully reset.\n\nAll existing active sessions have been terminated. If you did not make this change, please contact security immediately.\n\nBest regards,\nReddix Robotics Security`);
        return { message: 'Password has been successfully reset.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService,
        session_service_1.SessionService,
        user_session_service_1.UserSessionService,
        mail_service_1.MailService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map