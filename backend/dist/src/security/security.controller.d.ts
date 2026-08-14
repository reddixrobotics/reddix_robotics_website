import { SecurityService } from './security.service';
import type { SessionData } from '../auth/session.service';
import { VerifyTotpSetupDto } from './dto/verify-totp-setup.dto';
import { DisableTotpDto } from './dto/disable-totp.dto';
import { RegenerateBackupCodesDto } from './dto/regenerate-backup-codes.dto';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    setup2fa(session: SessionData): Promise<{
        secret: string;
        qrCodeUrl: string;
    }>;
    verify2faSetup(session: SessionData, verifyTotpSetupDto: VerifyTotpSetupDto): Promise<{
        backupCodes: string[];
    }>;
    disable2fa(session: SessionData, disableTotpDto: DisableTotpDto): Promise<{
        message: string;
    }>;
    regenerateBackupCodes(session: SessionData, regenerateDto: RegenerateBackupCodesDto): Promise<{
        backupCodes: string[];
    }>;
    listActiveSessions(session: SessionData, token: string): Promise<(Omit<SessionData, "role" | "adminId" | "needs2fa"> & {
        isCurrent: boolean;
    })[]>;
    terminateSession(session: SessionData, sessionId: string): Promise<{
        message: string;
    }>;
}
