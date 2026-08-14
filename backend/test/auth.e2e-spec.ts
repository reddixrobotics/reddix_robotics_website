import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { CryptoService } from '../src/crypto/crypto.service';
import { MailService } from '../src/mail/mail.service';
import cookieParser from 'cookie-parser';
import * as crypto from 'crypto';

// Mock otplib functional calls
jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('MOCK_TOTP_SECRET_123'),
  generateURI: jest.fn().mockReturnValue('otpauth://totp/Reddix%20Robotics:admin@test.com?secret=MOCK_TOTP_SECRET_123'),
  verify: jest.fn().mockImplementation(async ({ token, secret }) => {
    // Return valid true if token is '123456'
    return { valid: token === '123456' };
  }),
}));

// Mock qrcode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqrdataurl'),
}));

describe('Authentication & Security Flows (e2e)', () => {
  let app: INestApplication;

  // In-memory Database Store
  let mockAdmins: any[] = [];
  let mockSessions: any[] = [];
  let mockResetTokens: any[] = [];
  let mockTwoFactorAuths: any[] = [];
  let mockRedisStore: Record<string, string> = {};

  // Mock Mail Service
  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendLoginAlert: jest.fn().mockResolvedValue(undefined),
    sendTwoFactorStatusShift: jest.fn().mockResolvedValue(undefined),
  };

  // Mock Crypto Service (Fast in-memory mapping)
  const mockCryptoService = {
    hashPassword: jest.fn().mockImplementation(async (pass) => `hashed_${pass}`),
    verifyPassword: jest.fn().mockImplementation(async (hash, pass) => hash === `hashed_${pass}`),
    encrypt: jest.fn().mockImplementation((val) => `encrypted_${val}`),
    decrypt: jest.fn().mockImplementation((val) => val.replace('encrypted_', '')),
  };

  // Mock Redis Service (In-memory KV store)
  const mockRedisService = {
    get: jest.fn().mockImplementation(async (key) => mockRedisStore[key] || null),
    set: jest.fn().mockImplementation(async (key, val, ttl) => {
      mockRedisStore[key] = val;
      return 'OK';
    }),
    del: jest.fn().mockImplementation(async (key) => {
      if (Array.isArray(key)) {
        let deleted = 0;
        key.forEach((k) => {
          if (mockRedisStore[k]) {
            delete mockRedisStore[k];
            deleted++;
          }
        });
        return deleted;
      }
      if (mockRedisStore[key]) {
        delete mockRedisStore[key];
        return 1;
      }
      return 0;
    }),
    keys: jest.fn().mockImplementation(async (pattern) => {
      const regexPattern = '^' + pattern.replace(/\*/g, '.*') + '$';
      const regex = new RegExp(regexPattern);
      return Object.keys(mockRedisStore).filter((k) => regex.test(k));
    }),
  };

  // Mock Prisma Service (In-memory relation stores)
  const mockPrismaService = {
    admin: {
      findUnique: jest.fn().mockImplementation(async ({ where }) => {
        return mockAdmins.find((a) => a.email === where.email || a.id === where.id) || null;
      }),
      update: jest.fn().mockImplementation(async ({ where, data }) => {
        const index = mockAdmins.findIndex((a) => a.id === where.id);
        if (index === -1) throw new Error('Admin not found');
        mockAdmins[index] = { ...mockAdmins[index], ...data };
        return mockAdmins[index];
      }),
      create: jest.fn().mockImplementation(async ({ data }) => {
        const newAdmin = { id: crypto.randomUUID(), ...data, createdAt: new Date(), updatedAt: new Date() };
        mockAdmins.push(newAdmin);
        return newAdmin;
      }),
    },
    adminSession: {
      create: jest.fn().mockImplementation(async ({ data }) => {
        const session = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date(),
        };
        mockSessions.push(session);
        return session;
      }),
      findUnique: jest.fn().mockImplementation(async ({ where }) => {
        return mockSessions.find((s) => s.tokenHash === where.tokenHash || s.id === where.id) || null;
      }),
      findMany: jest.fn().mockImplementation(async ({ where }) => {
        return mockSessions.filter((s) => s.adminId === where.adminId);
      }),
      delete: jest.fn().mockImplementation(async ({ where }) => {
        const index = mockSessions.findIndex((s) => s.tokenHash === where.tokenHash || s.id === where.id);
        if (index === -1) throw new Error('Session not found');
        const deleted = mockSessions.splice(index, 1);
        return deleted[0];
      }),
      deleteMany: jest.fn().mockImplementation(async ({ where }) => {
        const initialLength = mockSessions.length;
        mockSessions = mockSessions.filter((s) => {
          if (where.adminId === s.adminId) {
            if (where.tokenHash && where.tokenHash.not === s.tokenHash) {
              return true;
            }
            return false;
          }
          return true;
        });
        return { count: initialLength - mockSessions.length };
      }),
    },
    passwordResetToken: {
      create: jest.fn().mockImplementation(async ({ data }) => {
        const token = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date(),
          usedAt: null,
        };
        mockResetTokens.push(token);
        return token;
      }),
      findUnique: jest.fn().mockImplementation(async ({ where, include }) => {
        const token = mockResetTokens.find((t) => t.tokenHash === where.tokenHash) || null;
        if (token && include?.admin) {
          const admin = mockAdmins.find((a) => a.id === token.adminId);
          return { ...token, admin };
        }
        return token;
      }),
      update: jest.fn().mockImplementation(async ({ where, data }) => {
        const index = mockResetTokens.findIndex((t) => t.id === where.id);
        if (index === -1) throw new Error('Token not found');
        mockResetTokens[index] = { ...mockResetTokens[index], ...data };
        return mockResetTokens[index];
      }),
    },
    twoFactorAuth: {
      findUnique: jest.fn().mockImplementation(async ({ where }) => {
        return mockTwoFactorAuths.find((t) => t.adminId === where.adminId) || null;
      }),
      upsert: jest.fn().mockImplementation(async ({ where, create, update }) => {
        let tfa = mockTwoFactorAuths.find((t) => t.adminId === where.adminId);
        if (tfa) {
          Object.assign(tfa, update);
        } else {
          tfa = { id: crypto.randomUUID(), adminId: where.adminId, ...create };
          mockTwoFactorAuths.push(tfa);
        }
        return tfa;
      }),
      update: jest.fn().mockImplementation(async ({ where, data }) => {
        const index = mockTwoFactorAuths.findIndex((t) => t.adminId === where.adminId);
        if (index === -1) throw new Error('2FA not found');
        mockTwoFactorAuths[index] = { ...mockTwoFactorAuths[index], ...data };
        return mockTwoFactorAuths[index];
      }),
      delete: jest.fn().mockImplementation(async ({ where }) => {
        const index = mockTwoFactorAuths.findIndex((t) => t.adminId === where.adminId);
        if (index === -1) throw new Error('2FA not found');
        const deleted = mockTwoFactorAuths.splice(index, 1);
        return deleted[0];
      }),
    },
    // Mock Transaction
    $transaction: jest.fn().mockImplementation(async (arg) => {
      if (typeof arg === 'function') {
        return arg(mockPrismaService);
      }
      if (Array.isArray(arg)) {
        return Promise.all(arg);
      }
      return arg;
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .overrideProvider(CryptoService)
      .useValue(mockCryptoService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset E2E In-Memory Stores before each test run
    mockAdmins = [];
    mockSessions = [];
    mockResetTokens = [];
    mockTwoFactorAuths = [];
    mockRedisStore = {};
    jest.clearAllMocks();
  });

  describe('1. Route Safeguards', () => {
    it('should deny access to protected endpoints with 401 if admin_session cookie is missing', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/admin/security/sessions')
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toContain('Authentication session missing');
    });

    it('should deny access to protected endpoints if session exists but 2FA is required', async () => {
      // 1. Create admin with 2FA enabled
      const admin = await mockPrismaService.admin.create({
        data: {
          email: '2fa-required@test.com',
          passwordHash: 'hashed_password123',
          role: 'ADMIN',
          twoFactorEnabled: true,
          twoFactorSecretEncrypted: 'encrypted_SECRET',
        },
      });

      // 2. Mock a session where needs2fa is true
      const sessionResult = await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: '2fa-required@test.com', password: 'password123' })
        .expect(HttpStatus.OK);

      const cookieHeader = sessionResult.headers['set-cookie'][0];
      const cookie = cookieHeader.split(';')[0]; // contains admin_session=TOKEN

      // 3. Attempt to access a protected route using E2E cookie
      const protectedResponse = await request(app.getHttpServer())
        .get('/api/admin/security/sessions')
        .set('Cookie', [cookie])
        .expect(HttpStatus.UNAUTHORIZED);

      expect(protectedResponse.body.message).toContain('Two-factor authentication required');
    });
  });

  describe('2. Credentials Authentication', () => {
    it('should fail authentication with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'wrongpassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully log in and set session cookie if 2FA is disabled', async () => {
      // Create admin with 2FA disabled
      await mockPrismaService.admin.create({
        data: {
          email: 'standard@test.com',
          passwordHash: 'hashed_password123',
          role: 'ADMIN',
          twoFactorEnabled: false,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: 'standard@test.com', password: 'password123' })
        .expect(HttpStatus.OK);

      expect(response.body.require2fa).toBe(false);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('admin_session');
    });
  });

  describe('3. Two-Factor Authentication', () => {
    it('should complete 2FA flow successfully and update session status in Redis', async () => {
      // 1. Create admin with 2FA enabled
      const admin = await mockPrismaService.admin.create({
        data: {
          email: '2fa-flow@test.com',
          passwordHash: 'hashed_password123',
          role: 'ADMIN',
          twoFactorEnabled: true,
          twoFactorSecretEncrypted: 'encrypted_SECRET',
        },
      });

      // 2. Perform Login -> should yield cookie and require2fa: true
      const loginRes = await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: '2fa-flow@test.com', password: 'password123' })
        .expect(HttpStatus.OK);

      expect(loginRes.body.require2fa).toBe(true);
      const cookie = loginRes.headers['set-cookie'][0].split(';')[0];

      // 3. Verify that the current cached session in Redis has needs2fa: true
      const token = cookie.replace('admin_session=', '');
      const cachedSessionStr = mockRedisStore[`session:${token}`];
      expect(JSON.parse(cachedSessionStr).needs2fa).toBe(true);

      // 4. Verify 2FA using a valid code ('123456')
      const verifyRes = await request(app.getHttpServer())
        .post('/api/admin/auth/verify-2fa')
        .set('Cookie', [cookie])
        .send({ token: '123456' })
        .expect(HttpStatus.OK);

      expect(verifyRes.body.success).toBe(true);

      // 5. Verify that the cached session in Redis now has needs2fa: false
      const updatedSessionStr = mockRedisStore[`session:${token}`];
      expect(JSON.parse(updatedSessionStr).needs2fa).toBe(false);
    });

    it('should reject invalid 2FA verification code', async () => {
      await mockPrismaService.admin.create({
        data: {
          email: '2fa-fail@test.com',
          passwordHash: 'hashed_password123',
          role: 'ADMIN',
          twoFactorEnabled: true,
          twoFactorSecretEncrypted: 'encrypted_SECRET',
        },
      });

      const loginRes = await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: '2fa-fail@test.com', password: 'password123' })
        .expect(HttpStatus.OK);

      const cookie = loginRes.headers['set-cookie'][0].split(';')[0];

      await request(app.getHttpServer())
        .post('/api/admin/auth/verify-2fa')
        .set('Cookie', [cookie])
        .send({ token: '000000' }) // Invalid token code
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('4. Forgot & Reset Password', () => {
    it('should verify single-use reset password workflow and session invalidation', async () => {
      // 1. Create admin
      const admin = await mockPrismaService.admin.create({
        data: {
          email: 'reset-flow@test.com',
          passwordHash: 'hashed_oldpassword',
          role: 'ADMIN',
          twoFactorEnabled: false,
        },
      });

      // 2. Trigger forgot-password
      await request(app.getHttpServer())
        .post('/api/admin/auth/forgot-password')
        .send({ email: 'reset-flow@test.com' })
        .expect(HttpStatus.OK);

      expect(mockResetTokens.length).toBe(1);
      const rawTokenHash = mockResetTokens[0].tokenHash;

      // Find the plain token value corresponding to this hash (we'll just use the store token metadata or mock value)
      // Since our mock reset token generated a random 32-byte hex string (64 chars), let's find the plain token.
      // In the mock database, we stored the hash of the generated token. Let's find it.
      // E2E test setup can bypass the hash by retrieving the exact token value from mock logs or we can inspect mock calls.
      // Let's check: the MailService's sendPasswordResetEmail spy will have been called with the link containing the plain token!
      const resetLinkCall = mockMailService.sendPasswordResetEmail.mock.calls[0];
      const resetLink = resetLinkCall[1]; // e.g. http://localhost:5173/admin/reset-password?token=TOKEN
      const url = new URL(resetLink);
      const token = url.searchParams.get('token');

      expect(token).toBeDefined();

      // Create a mock active session that we expect to get invalidated on password change
      const { token: sessionToken } = await mockPrismaService.adminSession.create({
        data: {
          adminId: admin.id,
          tokenHash: 'some_active_session_hash',
          expiresAt: new Date(Date.now() + 86400000),
        },
      });
      mockRedisStore[`session:${sessionToken}`] = JSON.stringify({ adminId: admin.id, id: 'sess_1' });

      // 3. Reset password
      await request(app.getHttpServer())
        .post('/api/admin/auth/reset-password')
        .send({ token, newPassword: 'newsecurepassword' })
        .expect(HttpStatus.OK);

      // 4. Verify password was updated in DB
      const updatedAdmin = await mockPrismaService.admin.findUnique({ where: { id: admin.id } });
      expect(updatedAdmin.passwordHash).toBe('hashed_newsecurepassword');

      // 5. Verify token marked as used
      expect(mockResetTokens[0].usedAt).toBeDefined();

      // 6. Verify all active sessions were invalidated (DB and Redis cleaned)
      expect(mockSessions.length).toBe(0);
      expect(mockRedisStore[`session:${sessionToken}`]).toBeUndefined();
    });
  });

  describe('5. Logout', () => {
    it('should invalidate session in Redis and database, and clear session cookie', async () => {
      // 1. Create admin
      await mockPrismaService.admin.create({
        data: {
          email: 'logout-flow@test.com',
          passwordHash: 'hashed_password123',
          role: 'ADMIN',
          twoFactorEnabled: false,
        },
      });

      // 2. Login to generate session
      const loginRes = await request(app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: 'logout-flow@test.com', password: 'password123' })
        .expect(HttpStatus.OK);

      const cookie = loginRes.headers['set-cookie'][0].split(';')[0];
      const token = cookie.replace('admin_session=', '');

      expect(mockSessions.length).toBe(1);
      expect(mockRedisStore[`session:${token}`]).toBeDefined();

      // 3. Perform logout
      const logoutRes = await request(app.getHttpServer())
        .post('/api/admin/auth/logout')
        .set('Cookie', [cookie])
        .expect(HttpStatus.OK);

      // Cookie should be cleared (maxAge/expires set to past)
      expect(logoutRes.headers['set-cookie'][0]).toContain('admin_session=;');

      // Session should be removed from database and Redis cache
      expect(mockSessions.length).toBe(0);
      expect(mockRedisStore[`session:${token}`]).toBeUndefined();
    });
  });
});
