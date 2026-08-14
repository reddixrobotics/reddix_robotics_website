import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { RedisService } from '../redis/redis.service';
import { SessionService, SessionData } from '../auth/session.service';
import { MailService } from '../mail/mail.service';
export declare class SecurityService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly redis;
    private readonly sessionService;
    private readonly mailService;
    private readonly TEMP_SECRET_PREFIX;
    constructor(prisma: PrismaService, cryptoService: CryptoService, redis: RedisService, sessionService: SessionService, mailService: MailService);
    setup2fa(adminId: string): Promise<{
        secret: string;
        qrCodeUrl: string;
    }>;
    verify2faSetup(adminId: string, code: string): Promise<{
        backupCodes: string[];
    }>;
    disable2fa(adminId: string, code: string): Promise<{
        message: string;
    }>;
    regenerateBackupCodes(adminId: string, plainTextPass: string): Promise<{
        backupCodes: string[];
    }>;
    listActiveSessions(adminId: string, currentToken: string): Promise<(Omit<SessionData, 'needs2fa' | 'role' | 'adminId'> & {
        isCurrent: boolean;
    })[]>;
    terminateSession(adminId: string, sessionId: string): Promise<void>;
}
