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
  ): Promise<{ backupCodes: string[] }> {
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

    // Generate 10 secure backup codes (e.g. 8-char hex string)
    const backupCodes: string[] = [];
    const hashedBackupCodes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const plainCode = crypto.randomBytes(4).toString('hex'); // 8 characters
      const hashedCode = crypto
        .createHash('sha256')
        .update(plainCode)
        .digest('hex');

      backupCodes.push(plainCode);
      hashedBackupCodes.push(hashedCode);
    }

    // Save to DB (update admin + create/update TwoFactorAuth record)
    await this.prisma.$transaction([
      this.prisma.admin.update({
        where: { id: adminId },
        data: {
          twoFactorEnabled: true,
          twoFactorSecretEncrypted: encryptedSecret,
        },
      }),
      this.prisma.twoFactorAuth.upsert({
        where: { adminId },
        create: {
          adminId,
          backupCodes: JSON.stringify(hashedBackupCodes),
          verifiedAt: new Date(),
        },
        update: {
          backupCodes: JSON.stringify(hashedBackupCodes),
          verifiedAt: new Date(),
        },
      }),
    ]);

    // Cleanup temporary secret
    await this.redis.del(tempKey);

    // Send security alert
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (admin) {
      await this.mailService.sendTwoFactorStatusShift(admin.email, true);
    }

    return { backupCodes };
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

    // 2. If not standard TOTP, check backup codes
    if (!isCodeValid) {
      const tfa = await this.prisma.twoFactorAuth.findUnique({
        where: { adminId },
      });

      if (tfa && tfa.backupCodes) {
        const hashedCodes: string[] = JSON.parse(tfa.backupCodes);
        const inputHash = crypto.createHash('sha256').update(code).digest('hex');
        const codeIndex = hashedCodes.indexOf(inputHash);

        if (codeIndex !== -1) {
          isCodeValid = true;
          // Consume the backup code
          hashedCodes.splice(codeIndex, 1);
          await this.prisma.twoFactorAuth.update({
            where: { adminId },
            data: { backupCodes: JSON.stringify(hashedCodes) },
          });
        }
      }
    }

    if (!isCodeValid) {
      throw new BadRequestException(
        'Invalid verification code or backup code',
      );
    }

    // Disable 2FA in DB
    await this.prisma.$transaction([
      this.prisma.admin.update({
        where: { id: adminId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecretEncrypted: null,
        },
      }),
      this.prisma.twoFactorAuth.delete({
        where: { adminId },
      }),
    ]);

    await this.mailService.sendTwoFactorStatusShift(admin.email, false);

    return { message: 'Two-factor authentication has been disabled.' };
  }

  /**
   * Regenerate Backup Codes
   * Re-authenticates using password and returns a new set of plaintext backup codes.
   */
  async regenerateBackupCodes(
    adminId: string,
    plainTextPass: string,
  ): Promise<{ backupCodes: string[] }> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Administrator not found');
    }

    // Re-authenticate password
    const isPasswordValid = await this.cryptoService.verifyPassword(
      admin.passwordHash,
      plainTextPass,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Re-authentication failed: Invalid password');
    }

    if (!admin.twoFactorEnabled) {
      throw new BadRequestException(
        'Two-factor authentication must be enabled to regenerate backup codes',
      );
    }

    // Generate 10 new secure backup codes
    const backupCodes: string[] = [];
    const hashedBackupCodes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const plainCode = crypto.randomBytes(4).toString('hex'); // 8 characters
      const hashedCode = crypto
        .createHash('sha256')
        .update(plainCode)
        .digest('hex');

      backupCodes.push(plainCode);
      hashedBackupCodes.push(hashedCode);
    }

    // Save to DB
    await this.prisma.twoFactorAuth.update({
      where: { adminId },
      data: {
        backupCodes: JSON.stringify(hashedBackupCodes),
      },
    });

    return { backupCodes };
  }

  /**
   * List all active sessions for an admin, marking the current session
   */
  async listActiveSessions(
    adminId: string,
    currentToken: string,
  ): Promise<(Omit<SessionData, 'needs2fa' | 'role' | 'adminId'> & { isCurrent: boolean })[]> {
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
