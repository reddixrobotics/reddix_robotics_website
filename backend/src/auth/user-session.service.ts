import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';

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

@Injectable()
export class UserSessionService {
  private readonly SESSION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds for normal users

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
    userId: string,
    role: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ token: string; session: UserSessionData }> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + this.SESSION_TTL * 1000);
    const authStatus = 'AUTHENTICATED';

    // Create session in database
    const dbSession = await this.prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
        authStatus,
      },
    });

    const session: UserSessionData = {
      id: dbSession.id,
      userId,
      role,
      authStatus,
      ipAddress,
      userAgent,
      createdAt: dbSession.createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Save session in Redis
    await this.redis.set(`user_session:${token}`, JSON.stringify(session), this.SESSION_TTL);

    return { token, session };
  }

  /**
   * Verify session token and return session data if valid
   */
  async verifySession(token: string): Promise<UserSessionData | null> {
    if (!token) return null;

    // 1. Try fetching from Redis
    const cached = await this.redis.get(`user_session:${token}`);
    if (cached) {
      const session = JSON.parse(cached) as UserSessionData;
      if (new Date(session.expiresAt) > new Date()) {
        return session;
      }
      // Session expired in cache
      await this.invalidateSession(token);
      return null;
    }

    // 2. Fallback to Database if Redis cache missed but session is still valid
    const tokenHash = this.hashToken(token);
    const dbSession = await this.prisma.userSession.findUnique({
      where: { tokenHash },
    });

    if (!dbSession) return null;

    if (dbSession.expiresAt < new Date()) {
      await this.prisma.userSession.delete({ where: { id: dbSession.id } });
      return null;
    }

    const session: UserSessionData = {
      id: dbSession.id,
      userId: dbSession.userId,
      role: 'USER', // Normal users always have USER role
      authStatus: dbSession.authStatus as 'AUTHENTICATED',
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
      await this.redis.set(`user_session:${token}`, JSON.stringify(session), remainingTtl);
    }

    return session;
  }

  /**
   * Invalidate a specific session token
   */
  async invalidateSession(token: string): Promise<void> {
    if (!token) return;

    // Delete from Redis
    await this.redis.del(`user_session:${token}`);

    // Delete from Database
    const tokenHash = this.hashToken(token);
    try {
      await this.prisma.userSession.delete({
        where: { tokenHash },
      });
    } catch (e) {
      // Session might have already been deleted from DB
    }
  }

  /**
   * Invalidate all active sessions for a user
   */
  async invalidateAllSessions(userId: string): Promise<void> {
    // Delete keys from Redis
    const keys = await this.redis.keys('user_session:*');
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const cached = JSON.parse(data) as UserSessionData;
        if (cached.userId === userId) {
          await this.redis.del(key);
        }
      }
    }

    // Delete records from database
    await this.prisma.userSession.deleteMany({
      where: { userId },
    });
  }
}
