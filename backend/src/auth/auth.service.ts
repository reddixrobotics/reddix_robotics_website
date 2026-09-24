import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { SessionService, SessionData } from './session.service';
import { UserSessionService, UserSessionData } from './user-session.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { generateSecret, verify } from 'otplib';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly sessionService: SessionService,
    private readonly userSessionService: UserSessionService,
    private readonly mailService: MailService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Register a new normal user
   */
  async signup(name: string, email: string, plainTextPass: string, phone?: string): Promise<{ message: string }> {
    // 1. Check if email already exists in User or Admin table
    const existingAdmin = await this.prisma.admin.findUnique({ where: { email } });
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingAdmin || existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    // 2. Hash the password
    const passwordHash = await this.cryptoService.hashPassword(plainTextPass);

    // 3. Create the user
    await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
      },
    });

    return { message: 'Account created successfully.' };
  }

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
  ): Promise<{ requireEmailOtp: boolean; isTwoFactorSetup?: boolean; token: string; session: SessionData | UserSessionData; role: string }> {
    // 1. Check if it's an admin
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      const passwordValid = await this.cryptoService.verifyPassword(
        admin.passwordHash,
        plainTextPass,
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      /* TEMPORARILY DISABLED: Email OTP & 2FA to bypass Railway SMTP blocks
      // Generate 6-digit random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in Redis (5 minutes TTL)
      await this.redis.set(`email_otp:${admin.id}`, otp, 300);

      // Log the OTP so it can be read from Railway logs (useful since Railway blocks SMTP)
      console.log(`\n\n=== ADMIN LOGIN OTP for ${admin.email} ===\nOTP CODE: ${otp}\n====================================\n\n`);

      // Send via email synchronously so errors can be handled
      try {
        await this.mailService.sendEmailOtp(admin.email, otp);
      } catch (e) {
        console.error('Failed to send OTP email due to Railway SMTP block. The OTP has been printed above.');
        // We will NOT throw an error here, so the user can still proceed to the OTP step
        // and type the OTP they see in the Railway logs.
      }
      */

      const { token, session } = await this.sessionService.createSession(
        admin.id,
        admin.role,
        'AUTHENTICATED', // Bypass 'PENDING_EMAIL_OTP' and 'PENDING_AUTHENTICATOR'
        ipAddress,
        userAgent,
      );

      return {
        requireEmailOtp: false, // Bypass frontend OTP screen
        isTwoFactorSetup: admin.twoFactorEnabled,
        token,
        session,
        role: admin.role,
      };
    }

    // 2. If not admin, check if it's a normal user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const passwordValid = await this.cryptoService.verifyPassword(
        user.passwordHash,
        plainTextPass,
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Create a user session directly
      const { token, session } = await this.userSessionService.createSession(
        user.id,
        user.role,
        ipAddress,
        userAgent,
      );

      return {
        requireEmailOtp: false,
        token,
        session,
        role: user.role,
      };
    }

    // 3. Neither admin nor user found
    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Verify the Email OTP
   */
  async verifyEmailOtp(token: string, otp: string): Promise<SessionData> {
    const session = await this.sessionService.verifySession(token);
    if (!session || session.authStatus !== 'PENDING_EMAIL_OTP') {
      throw new UnauthorizedException('Invalid or expired session for email verification');
    }

    const cachedOtp = await this.redis.get(`email_otp:${session.adminId}`);
    if (!cachedOtp || cachedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    // OTP is valid, remove it
    await this.redis.del(`email_otp:${session.adminId}`);

    // Upgrade session to PENDING_AUTHENTICATOR
    const updatedSession = await this.sessionService.updateSession(token, {
      authStatus: 'PENDING_AUTHENTICATOR',
    });

    if (!updatedSession) {
      throw new UnauthorizedException('Failed to update session');
    }

    return updatedSession;
  }

  /**
   * Resend Email OTP
   */
  async resendEmailOtp(token: string): Promise<void> {
    const session = await this.sessionService.verifySession(token);
    if (!session || session.authStatus !== 'PENDING_EMAIL_OTP') {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid admin');
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis (5 minutes TTL)
    await this.redis.set(`email_otp:${admin.id}`, otp, 300);

    // Log the OTP so it can be read from Railway logs (useful since Railway blocks SMTP)
    console.log(`\n\n=== ADMIN LOGIN OTP (RESEND) for ${admin.email} ===\nOTP CODE: ${otp}\n====================================\n\n`);

    // Send via email synchronously so errors can be handled
    try {
      await this.mailService.sendEmailOtp(admin.email, otp);
    } catch (e) {
      console.error('Failed to send OTP email due to Railway SMTP block. The OTP has been printed above.');
      // Do not throw so they don't get an error
    }
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
    if (!session || session.authStatus !== 'PENDING_AUTHENTICATOR') {
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
      throw new UnauthorizedException('Invalid authenticator code');
    }

    // Update session to clear needs2fa requirement
    const updatedSession = await this.sessionService.updateSession(token, {
      authStatus: 'AUTHENTICATED',
    });

    if (!updatedSession) {
      throw new UnauthorizedException('Failed to update session');
    }

    // Send successful login alert post-2FA verification asynchronously
    this.mailService.sendLoginAlert(admin.email, ipAddress || 'Unknown', userAgent || 'Unknown').catch(e => console.error('Failed to send login alert email:', e));

    return updatedSession;
  }

  /**
   * Log out admin by invalidating session token
   */
  async logout(token: string): Promise<void> {
    await this.sessionService.invalidateSession(token);
  }

  /**
   * Log out user by invalidating session token
   */
  async logoutUser(token: string): Promise<void> {
    await this.userSessionService.invalidateSession(token);
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
