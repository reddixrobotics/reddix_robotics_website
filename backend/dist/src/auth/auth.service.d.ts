import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { SessionService, SessionData } from './session.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly sessionService;
    private readonly mailService;
    constructor(prisma: PrismaService, cryptoService: CryptoService, sessionService: SessionService, mailService: MailService);
    login(email: string, plainTextPass: string, ipAddress?: string, userAgent?: string): Promise<{
        require2fa: boolean;
        token: string;
        session: SessionData;
    }>;
    verify2fa(token: string, totpCode: string, ipAddress?: string, userAgent?: string): Promise<SessionData>;
    logout(token: string): Promise<void>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
