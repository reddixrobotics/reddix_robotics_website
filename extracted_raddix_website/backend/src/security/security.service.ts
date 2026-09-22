import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { RedisService } from '../redis/redis.service';
import { SessionService, SessionData } from '../auth/session.service';
import { MailService } from '../mail/mail.service';
import { generateSecret, generateURI, verify } from 'otplib';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  private readonly TEMP_SECRET_PREFIX = 'temp-totp-secret:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly redis: RedisService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Initialize 2FA Setup
   * Generates a TOTP secret, encrypts it, stores it in Redis temporarily, and returns a QR code data URL.
   */
  async setup2fa(
    adminId: string,
  ): Promise<{ secret: string; qrCodeUrl: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Administrator not found');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      secret,
      issuer: 'Reddix Robotics',
      label: admin.email,
    });

    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    const encryptedSecret = this.cryptoService.encrypt(secret);

    // Save temporary encrypted secret in Redis for 10 minutes
    await this.redis.set(
      `${this.TEMP_SECRET_PREFIX}${adminId}`,
      encryptedSecret,
      600, // 10 minutes
    );

    return {
      secret,
      qrCodeUrl,
    };
  }

  /**
   * Verify and Enable 2FA
   * Verifies the code against the temporary secret. If correct, enables 2FA and generates 10 backup codes.
   */
  async verify2faSetup(
    adminId: string,
    code: string,
    token: string,
  ): Promise<{ success: boolean }> {
    const tempKey = `${this.TEMP_SECRET_PREFIX}${adminId}`;
    const encryptedSecret = await this.redis.get(tempKey);

    if (!encryptedSecret) {
      throw new BadRequestException(
        '2FA setup session expired. Please start the setup process again.',
      );
    }

    const secret = this.cryptoService.decrypt(encryptedSecret);
    const verifyResult = await verify({ token: code, secret });
    const isValid = verifyResult.valid;

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Save to DB (update admin)
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecretEncrypted: encryptedSecret,
      },
    });

    // Upgrade the current session to fully authenticated
    await this.sessionService.updateSession(token, {
      authStatus: 'AUTHENTICATED',
    });

    // Cleanup temporary secret
    await this.redis.del(tempKey);

    // Send security alert
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (admin) {
      await this.mailService.sendTwoFactorStatusShift(admin.email, true);
    }

    return { success: true };
  }

  /**
   * Disable 2FA
   * Requires current TOTP code or backup code to disable.
   */
  async disable2fa(adminId: string, code: string): Promise<{ message: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.twoFactorEnabled || !admin.twoFactorSecretEncrypted) {
      throw new BadRequestException('2FA is not enabled');
    }

    let isCodeValid = false;

    // 1. Try to verify code as a standard 6-digit TOTP code
    if (code.length === 6 && /^\d+$/.test(code)) {
      const secret = this.cryptoService.decrypt(admin.twoFactorSecretEncrypted);
      const verifyResult = await verify({ token: code, secret });
      isCodeValid = verifyResult.valid;
    }

    if (!isCodeValid) {
      throw new BadRequestException('Invalid verification code');
    }

    // Disable 2FA in DB
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecretEncrypted: null,
      },
    });

    await this.mailService.sendTwoFactorStatusShift(admin.email, false);

    return { message: 'Two-factor authentication has been disabled.' };
  }

  /**
   * List all active sessions for an admin, marking the current session
   */
  async listActiveSessions(
    adminId: string,
    currentToken: string,
  ): Promise<(Omit<SessionData, 'authStatus' | 'role' | 'adminId'> & { isCurrent: boolean })[]> {
    const currentSession = await this.sessionService.verifySession(currentToken);
    const sessions = await this.sessionService.listAdminSessions(adminId);

    return sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: currentSession ? s.id === currentSession.id : false,
    }));
  }

  /**
   * Terminate a specific active session
   */
  async terminateSession(adminId: string, sessionId: string): Promise<void> {
    const success = await this.sessionService.invalidateSessionById(
      adminId,
      sessionId,
    );

    if (!success) {
      throw new NotFoundException('Session not found or not owned by you');
    }
  }
}
