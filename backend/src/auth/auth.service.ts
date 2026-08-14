import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { SessionService, SessionData } from './session.service';
import { MailService } from '../mail/mail.service';
import { generateSecret, verify } from 'otplib';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Log in admin by email and password.
   * If 2FA is enabled, creates a temporary session with needs2fa: true.
   * If 2FA is disabled, creates a normal session with needs2fa: false.
   */
  async login(
    email: string,
    plainTextPass: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ require2fa: boolean; token: string; session: SessionData }> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.cryptoService.verifyPassword(
      admin.passwordHash,
      plainTextPass,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { token, session } = await this.sessionService.createSession(
      admin.id,
      admin.role,
      admin.twoFactorEnabled, // if 2fa is enabled, needs2fa is true
      ipAddress,
      userAgent,
    );

    // Send login alert email if 2FA is not enabled (since 2FA acts as security step itself)
    if (!admin.twoFactorEnabled) {
      await this.mailService.sendLoginAlert(admin.email, ipAddress || 'Unknown', userAgent || 'Unknown');
    }

    return {
      require2fa: admin.twoFactorEnabled,
      token,
      session,
    };
  }

  /**
   * Verify TOTP code against active session
   */
  async verify2fa(
    token: string,
    totpCode: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<SessionData> {
    const session = await this.sessionService.verifySession(token);
    if (!session || !session.needs2fa) {
      throw new UnauthorizedException('Invalid or inactive 2FA session');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin || !admin.twoFactorSecretEncrypted) {
      throw new UnauthorizedException('2FA is not set up for this administrator');
    }

    // Decrypt TOTP secret
    const secret = this.cryptoService.decrypt(admin.twoFactorSecretEncrypted);

    // Verify TOTP code
    const verifyResult = await verify({
      token: totpCode,
      secret,
    });
    const isTokenValid = verifyResult.valid;

    if (!isTokenValid) {
      // Check if it's a backup code instead
      const tfaConfig = await this.prisma.twoFactorAuth.findUnique({
        where: { adminId: admin.id },
      });

      if (tfaConfig && tfaConfig.backupCodes) {
        const hashedCodes: string[] = JSON.parse(tfaConfig.backupCodes);
        const inputCodeHash = crypto.createHash('sha256').update(totpCode).digest('hex');
        const codeIndex = hashedCodes.indexOf(inputCodeHash);

        if (codeIndex !== -1) {
          // Backup code matches! Remove it from the list
          hashedCodes.splice(codeIndex, 1);
          await this.prisma.twoFactorAuth.update({
            where: { adminId: admin.id },
            data: { backupCodes: JSON.stringify(hashedCodes) },
          });
        } else {
          throw new UnauthorizedException('Invalid verification code');
        }
      } else {
        throw new UnauthorizedException('Invalid verification code');
      }
    }

    // Update session to clear needs2fa requirement
    const updatedSession = await this.sessionService.updateSession(token, {
      needs2fa: false,
    });

    if (!updatedSession) {
      throw new UnauthorizedException('Failed to update session');
    }

    // Send successful login alert post-2FA verification
    await this.mailService.sendLoginAlert(admin.email, ipAddress || 'Unknown', userAgent || 'Unknown');

    return updatedSession;
  }

  /**
   * Log out admin by invalidating session token
   */
  async logout(token: string): Promise<void> {
    await this.sessionService.invalidateSession(token);
  }

  /**
   * Generate password reset token, save to DB, and send link via email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    // Do not leak whether the email exists. Return success message either way.
    if (!admin) {
      return { message: 'If the email matches an administrator, a password reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    // Create password reset record
    await this.prisma.passwordResetToken.create({
      data: {
        adminId: admin.id,
        tokenHash,
        expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/admin/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetEmail(admin.email, resetLink);

    return { message: 'If the email matches an administrator, a password reset link has been sent.' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { admin: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // Hash the new password
    const passwordHash = await this.cryptoService.hashPassword(newPassword);

    // Update Admin password, mark token as used
    await this.prisma.$transaction([
      this.prisma.admin.update({
        where: { id: resetToken.adminId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Invalidate all active sessions for this admin
    await this.sessionService.invalidateAllSessions(resetToken.adminId);

    // Log security alert
    await this.mailService.sendMail(
      resetToken.admin.email,
      'Security Alert: Password Changed - Reddix Robotics',
      `Hello,\n\nThe password for your administrator account was successfully reset.\n\nAll existing active sessions have been terminated. If you did not make this change, please contact security immediately.\n\nBest regards,\nReddix Robotics Security`,
    );

    return { message: 'Password has been successfully reset.' };
  }
}
