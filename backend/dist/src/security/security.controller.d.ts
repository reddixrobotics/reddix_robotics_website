import { SecurityService } from './security.service';
import type { SessionData } from '../auth/session.service';
import { VerifyTotpSetupDto } from './dto/verify-totp-setup.dto';
import { DisableTotpDto } from './dto/disable-totp.dto';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    setup2fa(session: SessionData): Promise<{
        secret: string;
        qrCodeUrl: string;
    }>;
    verify2faSetup(session: SessionData, token: string, verifyTotpSetupDto: VerifyTotpSetupDto): Promise<{
        success: boolean;
    }>;
    disable2fa(session: SessionData, disableTotpDto: DisableTotpDto): Promise<{
        message: string;
    }>;
    listActiveSessions(session: SessionData, token: string): Promise<(Omit<SessionData, "role" | "authStatus" | "adminId"> & {
        isCurrent: boolean;
    })[]>;
    terminateSession(session: SessionData, sessionId: string): Promise<{
        message: string;
    }>;
}
