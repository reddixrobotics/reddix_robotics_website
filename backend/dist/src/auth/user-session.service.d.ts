import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export interface UserSessionData {
    id: string;
    userId: string;
    role: string;
    authStatus: 'AUTHENTICATED';
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    expiresAt: string;
}
export declare class UserSessionService {
    private readonly prisma;
    private readonly redis;
    private readonly SESSION_TTL;
    constructor(prisma: PrismaService, redis: RedisService);
    private hashToken;
    createSession(userId: string, role: string, ipAddress?: string, userAgent?: string): Promise<{
        token: string;
        session: UserSessionData;
    }>;
    verifySession(token: string): Promise<UserSessionData | null>;
    invalidateSession(token: string): Promise<void>;
    invalidateAllSessions(userId: string): Promise<void>;
}
