import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';

export interface SessionData {
  id: string;
  adminId: string;
  role: string;
  needs2fa: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
}

@Injectable()
export class SessionService {
  private readonly SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Helper to hash session tokens for database lookup
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Create a new session in Redis and PostgreSQL
   */
  async createSession(
    adminId: string,
    role: string,
    needs2fa: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ token: string; session: SessionData }> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + this.SESSION_TTL * 1000);

    // Create session in database
    const dbSession = await this.prisma.adminSession.create({
      data: {
        adminId,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    const session: SessionData = {
      id: dbSession.id,
      adminId,
      role,
      needs2fa,
      ipAddress,
      userAgent,
      createdAt: dbSession.createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Save session in Redis
    await this.redis.set(`session:${token}`, JSON.stringify(session), this.SESSION_TTL);

    return { token, session };
  }

  /**
   * Verify session token and return session data if valid
   */
  async verifySession(token: string): Promise<SessionData | null> {
    if (!token) return null;

    // 1. Try fetching from Redis
    const cached = await this.redis.get(`session:${token}`);
    if (cached) {
      const session = JSON.parse(cached) as SessionData;
      if (new Date(session.expiresAt) > new Date()) {
        return session;
      }
      // Session expired in cache
      await this.invalidateSession(token);
      return null;
    }

    // 2. Fallback to Database if Redis cache missed but session is still valid
    const tokenHash = this.hashToken(token);
    const dbSession = await this.prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { admin: true },
    });

    if (!dbSession) return null;

    if (dbSession.expiresAt < new Date()) {
      await this.prisma.adminSession.delete({ where: { id: dbSession.id } });
      return null;
    }

    const session: SessionData = {
      id: dbSession.id,
      adminId: dbSession.adminId,
      role: dbSession.admin.role,
      needs2fa: dbSession.admin.twoFactorEnabled, // fallback to admin profile state
      ipAddress: dbSession.ipAddress || undefined,
      userAgent: dbSession.userAgent || undefined,
      createdAt: dbSession.createdAt.toISOString(),
      expiresAt: dbSession.expiresAt.toISOString(),
    };

    // Repopulate Redis cache
    const remainingTtl = Math.max(
      0,
      Math.floor((dbSession.expiresAt.getTime() - Date.now()) / 1000),
    );
    if (remainingTtl > 0) {
      await this.redis.set(`session:${token}`, JSON.stringify(session), remainingTtl);
    }

    return session;
  }

  /**
   * Update fields (e.g. needs2fa) of an active session
   */
  async updateSession(token: string, data: Partial<Pick<SessionData, 'needs2fa'>>): Promise<SessionData | null> {
    const session = await this.verifySession(token);
    if (!session) return null;

    const updatedSession = { ...session, ...data };
    const remainingTtl = Math.max(
      0,
      Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
    );

    // Save in Redis
    await this.redis.set(`session:${token}`, JSON.stringify(updatedSession), remainingTtl);

    return updatedSession;
  }

  /**
   * Invalidate a specific session token
   */
  async invalidateSession(token: string): Promise<void> {
    if (!token) return;

    // Delete from Redis
    await this.redis.del(`session:${token}`);

    // Delete from Database
    const tokenHash = this.hashToken(token);
    try {
      await this.prisma.adminSession.delete({
        where: { tokenHash },
      });
    } catch (e) {
      // Session might have already been deleted from DB
    }
  }

  /**
   * Terminate a specific session by its database ID
   */
  async invalidateSessionById(adminId: string, id: string): Promise<boolean> {
    const session = await this.prisma.adminSession.findFirst({
      where: { id, adminId },
    });

    if (!session) return false;

    // Delete from database
    await this.prisma.adminSession.delete({ where: { id } });

    // Since we don't have the cleartext token here, we need to locate and delete it from Redis.
    // We can scan the Redis keys matching `session:*` and delete the one matching this session ID.
    const keys = await this.redis.keys('session:*');
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const cached = JSON.parse(data) as SessionData;
        if (cached.id === id) {
          await this.redis.del(key);
          break;
        }
      }
    }

    return true;
  }

  /**
   * List all active sessions for an admin
   */
  async listAdminSessions(adminId: string): Promise<Omit<SessionData, 'needs2fa' | 'role'>[]> {
    const dbSessions = await this.prisma.adminSession.findMany({
      where: {
        adminId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return dbSessions.map((s) => ({
      id: s.id,
      adminId: s.adminId,
      ipAddress: s.ipAddress || undefined,
      userAgent: s.userAgent || undefined,
      createdAt: s.createdAt.toISOString(),
      expiresAt: s.expiresAt.toISOString(),
    }));
  }

  /**
   * Invalidate all active sessions for an admin except a current token
   */
  async invalidateAllExcept(adminId: string, currentToken: string): Promise<void> {
    const currentTokenHash = this.hashToken(currentToken);

    // Fetch all active sessions from DB to get their token hashes
    const activeSessions = await this.prisma.adminSession.findMany({
      where: {
        adminId,
        tokenHash: { not: currentTokenHash },
      },
    });

    // Delete keys from Redis
    const keys = await this.redis.keys('session:*');
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const cached = JSON.parse(data) as SessionData;
        if (cached.adminId === adminId && key !== `session:${currentToken}`) {
          await this.redis.del(key);
        }
      }
    }

    // Delete records from database
    await this.prisma.adminSession.deleteMany({
      where: {
        adminId,
        tokenHash: { not: currentTokenHash },
      },
    });
  }

  /**
   * Invalidate all sessions for an admin (e.g. on password reset)
   */
  async invalidateAllSessions(adminId: string): Promise<void> {
    // Delete keys from Redis
    const keys = await this.redis.keys('session:*');
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const cached = JSON.parse(data) as SessionData;
        if (cached.adminId === adminId) {
          await this.redis.del(key);
        }
      }
    }

    // Delete records from database
    await this.prisma.adminSession.deleteMany({
      where: { adminId },
    });
  }
}
