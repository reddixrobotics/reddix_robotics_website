import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Ip,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { UserAuthGuard } from './guards/user-auth.guard';
import { CurrentSession } from './decorators/current-session.decorator';
import type { SessionData } from './session.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserSessionService } from './user-session.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly userSessionService: UserSessionService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Session check — lightweight, allow more requests
   */
  @Get('session')
  @SkipThrottle({ default: true, global: true })
  @HttpCode(HttpStatus.OK)
  async getSession(@Req() req: Request) {
    const adminToken = req.cookies['admin_session'];
    const userToken = req.cookies['user_session'];

    if (adminToken) {
      const session = await this.sessionService.verifySession(adminToken);
      if (session) {
        const admin = await this.prisma.admin.findUnique({
          where: { id: session.adminId },
          select: { twoFactorEnabled: true }
        });

        return {
          authenticated: true,
          session,
          isTwoFactorSetup: admin?.twoFactorEnabled || false,
          authStatus: session.authStatus,
          role: session.role,
        };
      }
    }

    if (userToken) {
      const session = await this.userSessionService.verifySession(userToken);
      if (session) {
        return {
          authenticated: true,
          session,
          authStatus: session.authStatus,
          role: session.role,
        };
      }
    }

    return { authenticated: false };
  }

  /**
   * TEMPORARY ENDPOINT: Seed the default admin account.
   * Visit /api/auth/seed-admin in your browser to create the admin account on Railway.
   */
  @Get('seed-admin')
  @SkipThrottle({ default: true, global: true })
  async seedAdmin() {
    const email = 'admin@reddixrobotics.com';
    const password = 'ReddixAdminSecure2026!';

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return { message: `Admin account (${email}) already exists in the database!` };
    }

    // Require crypto service to hash password (we can use argon2 directly or via authService, but wait, authService doesn't expose it, so let's import argon2)
    // Actually we can just require argon2 here since it's already in the project.
    const argon2 = require('argon2');
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await this.prisma.admin.create({
      data: {
        email,
        passwordHash,
        role: 'SUPER_ADMIN',
        twoFactorEnabled: false,
      },
    });

    return { 
      message: 'Admin account created successfully!',
      email: email,
      password: password
    };
  }

  /**
   * Admin profile — returns twoFactorEnabled status and email.
   * Protected: requires a fully authenticated session (no pending 2FA).
   */
  @Get('profile')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentSession() session: SessionData) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Administrator not found');
    }

    return admin;
  }

  /**
   * User Signup
   */
  @Post('signup')
  @Throttle({ default: { ttl: 60_000, limit: 3 } }) // 3 signups per minute per IP
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
      signupDto.phone,
    );
  }

  /**
   * Login endpoint — stricter rate limit: 8 attempts per 2 minutes per IP.
   * Prevents credential brute-forcing.
   */
  @Post('login')
  @Throttle({ default: { ttl: 120_000, limit: 8 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
      ip,
      userAgent,
    );

    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER'];

    // Set appropriate cookie based on role
    if (adminRoles.includes(result.role)) {
      res.cookie('admin_session', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      if (result.requireEmailOtp) {
        return {
          requireEmailOtp: true,
          isTwoFactorSetup: result.isTwoFactorSetup,
          message: 'Email verification is required',
          role: result.role,
        };
      }
    } else if (result.role === 'USER') {
      res.cookie('user_session', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    return {
      requireEmailOtp: false,
      message: 'Login successful',
      session: result.session,
      role: result.role,
    };
  }

  /**
   * Verify Email OTP
   */
  @Post('verify-email-otp')
  @Throttle({ default: { ttl: 300_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async verifyEmailOtp(
    @Body('otp') otp: string,
    @Req() req: Request,
  ) {
    const token = req.cookies['admin_session'];
    if (!token) {
      throw new UnauthorizedException('No active session found');
    }

    const session = await this.authService.verifyEmailOtp(token, otp);

    const admin = await this.prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { twoFactorEnabled: true }
    });

    return {
      success: true,
      message: 'Email OTP verified',
      session,
      isTwoFactorSetup: admin?.twoFactorEnabled || false,
    };
  }

  /**
   * Resend Email OTP
   */
  @Post('resend-email-otp')
  @Throttle({ default: { ttl: 300_000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async resendEmailOtp(
    @Req() req: Request,
  ) {
    const token = req.cookies['admin_session'];
    if (!token) {
      throw new UnauthorizedException('No active session found');
    }

    await this.authService.resendEmailOtp(token);

    return {
      success: true,
      message: 'Email OTP resent',
    };
  }

  /**
   * 2FA verification — strictest rate limit: 5 attempts per 5 minutes per IP.
   * After 5 failures, the IP is temporarily blocked. This prevents TOTP brute-forcing.
   */
  @Post('verify-2fa')
  @Throttle({ default: { ttl: 300_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async verify2fa(
    @Body() verify2faDto: Verify2faDto,
    @Req() req: Request,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const token = req.cookies['admin_session'];
    if (!token) {
      throw new UnauthorizedException('No active session found');
    }

    const session = await this.authService.verify2fa(
      token,
      verify2faDto.token,
      ip,
      userAgent,
    );

    return {
      success: true,
      message: 'Authentication successful',
      session,
    };
  }

  /**
   * Logout — clears session from Redis, DB, and browser cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const adminToken = req.cookies['admin_session'];
    if (adminToken) {
      await this.authService.logout(adminToken);
      res.clearCookie('admin_session', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    const userToken = req.cookies['user_session'];
    if (userToken) {
      await this.authService.logoutUser(userToken);
      res.clearCookie('user_session', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }

    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @Throttle({ default: { ttl: 600_000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Get('user/profile')
  @UseGuards(UserAuthGuard)
  async getUserProfile(@Req() req: Request) {
    const userId = (req as any).user.id;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Get('user/applications')
  @UseGuards(UserAuthGuard)
  async getUserApplications(@Req() req: Request) {
    const userId = (req as any).user.id;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const [applications, registrations] = await Promise.all([
      this.prisma.application.findMany({
        where: { email: user.email },
        include: { job: true, internship: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.workshopRegistration.findMany({
        where: { email: user.email },
        include: { workshop: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { applications, registrations };
  }
}
