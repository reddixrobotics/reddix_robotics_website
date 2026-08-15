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
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_service_1 = require("../crypto/crypto.service");
const redis_service_1 = require("../redis/redis.service");
const session_service_1 = require("../auth/session.service");
const mail_service_1 = require("../mail/mail.service");
const otplib_1 = require("otplib");
const qrcode = __importStar(require("qrcode"));
let SecurityService = class SecurityService {
    prisma;
    cryptoService;
    redis;
    sessionService;
    mailService;
    TEMP_SECRET_PREFIX = 'temp-totp-secret:';
    constructor(prisma, cryptoService, redis, sessionService, mailService) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
        this.redis = redis;
        this.sessionService = sessionService;
        this.mailService = mailService;
    }
    async setup2fa(adminId) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrator not found');
        }
        const secret = (0, otplib_1.generateSecret)();
        const otpauthUrl = (0, otplib_1.generateURI)({
            secret,
            issuer: 'Reddix Robotics',
            label: admin.email,
        });
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
        const encryptedSecret = this.cryptoService.encrypt(secret);
        await this.redis.set(`${this.TEMP_SECRET_PREFIX}${adminId}`, encryptedSecret, 600);
        return {
            secret,
            qrCodeUrl,
        };
    }
    async verify2faSetup(adminId, code, token) {
        const tempKey = `${this.TEMP_SECRET_PREFIX}${adminId}`;
        const encryptedSecret = await this.redis.get(tempKey);
        if (!encryptedSecret) {
            throw new common_1.BadRequestException('2FA setup session expired. Please start the setup process again.');
        }
        const secret = this.cryptoService.decrypt(encryptedSecret);
        const verifyResult = await (0, otplib_1.verify)({ token: code, secret });
        const isValid = verifyResult.valid;
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        await this.prisma.admin.update({
            where: { id: adminId },
            data: {
                twoFactorEnabled: true,
                twoFactorSecretEncrypted: encryptedSecret,
            },
        });
        await this.sessionService.updateSession(token, {
            authStatus: 'AUTHENTICATED',
        });
        await this.redis.del(tempKey);
        const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
        if (admin) {
            await this.mailService.sendTwoFactorStatusShift(admin.email, true);
        }
        return { success: true };
    }
    async disable2fa(adminId, code) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: adminId },
        });
        if (!admin || !admin.twoFactorEnabled || !admin.twoFactorSecretEncrypted) {
            throw new common_1.BadRequestException('2FA is not enabled');
        }
        let isCodeValid = false;
        if (code.length === 6 && /^\d+$/.test(code)) {
            const secret = this.cryptoService.decrypt(admin.twoFactorSecretEncrypted);
            const verifyResult = await (0, otplib_1.verify)({ token: code, secret });
            isCodeValid = verifyResult.valid;
        }
        if (!isCodeValid) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        await this.prisma.admin.update({
            where: { id: adminId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecretEncrypted: null,
            },
        });
        await this.mailService.sendTwoFactorStatusShift(admin.email, false);
        return { message: 'Two-factor authentication has been disabled.' };
    }
    async listActiveSessions(adminId, currentToken) {
        const currentSession = await this.sessionService.verifySession(currentToken);
        const sessions = await this.sessionService.listAdminSessions(adminId);
        return sessions.map((s) => ({
            id: s.id,
            ipAddress: s.ipAddress,
            userAgent: s.userAgent,
            createdAt: s.createdAt,
            expiresAt: s.expiresAt,
            isCurrent: currentSession ? s.id === currentSession.id : false,
        }));
    }
    async terminateSession(adminId, sessionId) {
        const success = await this.sessionService.invalidateSessionById(adminId, sessionId);
        if (!success) {
            throw new common_1.NotFoundException('Session not found or not owned by you');
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService,
        redis_service_1.RedisService,
        session_service_1.SessionService,
        mail_service_1.MailService])
], SecurityService);
//# sourceMappingURL=security.service.js.map