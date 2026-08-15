import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { SessionService, SessionData } from './session.service';
import { UserSessionService, UserSessionData } from './user-session.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
export declare class AuthService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly sessionService;
    private readonly userSessionService;
    private readonly mailService;
    private readonly redis;
    constructor(prisma: PrismaService, cryptoService: CryptoService, sessionService: SessionService, userSessionService: UserSessionService, mailService: MailService, redis: RedisService);
    signup(name: string, email: string, plainTextPass: string, phone?: string): Promise<{
        message: string;
    }>;
    login(email: string, plainTextPass: string, ipAddress?: string, userAgent?: string): Promise<{
        requireEmailOtp: boolean;
        isTwoFactorSetup?: boolean;
        token: string;
        session: SessionData | UserSessionData;
        role: string;
    }>;
    verifyEmailOtp(token: string, otp: string): Promise<SessionData>;
    resendEmailOtp(token: string): Promise<void>;
    verify2fa(token: string, totpCode: string, ipAddress?: string, userAgent?: string): Promise<SessionData>;
    logout(token: string): Promise<void>;
    logoutUser(token: string): Promise<void>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
