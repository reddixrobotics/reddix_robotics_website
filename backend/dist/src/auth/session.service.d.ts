import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export interface SessionData {
    id: string;
    adminId: string;
    role: string;
    authStatus: 'PENDING_EMAIL_OTP' | 'PENDING_AUTHENTICATOR' | 'AUTHENTICATED';
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    expiresAt: string;
}
export declare class SessionService {
    private readonly prisma;
    private readonly redis;
    private readonly SESSION_TTL;
    constructor(prisma: PrismaService, redis: RedisService);
    private hashToken;
    createSession(adminId: string, role: string, authStatus: 'PENDING_EMAIL_OTP' | 'PENDING_AUTHENTICATOR' | 'AUTHENTICATED', ipAddress?: string, userAgent?: string): Promise<{
        token: string;
        session: SessionData;
    }>;
    verifySession(token: string): Promise<SessionData | null>;
    updateSession(token: string, data: Partial<Pick<SessionData, 'authStatus'>>): Promise<SessionData | null>;
    invalidateSession(token: string): Promise<void>;
    invalidateSessionById(adminId: string, id: string): Promise<boolean>;
    listAdminSessions(adminId: string): Promise<Omit<SessionData, 'authStatus' | 'role'>[]>;
    invalidateAllExcept(adminId: string, currentToken: string): Promise<void>;
    invalidateAllSessions(adminId: string): Promise<void>;
}
