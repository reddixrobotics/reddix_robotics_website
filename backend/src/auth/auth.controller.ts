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
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('session')
  @HttpCode(HttpStatus.OK)
  async getSession(@Req() req: Request) {
    const token = req.cookies['admin_session'];
    if (!token) {
      return { authenticated: false };
    }
    const session = await this.sessionService.verifySession(token);
    if (!session) {
      return { authenticated: false };
    }
    return {
      authenticated: true,
      session,
    };
  }

  @Post('login')
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

    // Set cookie
    res.cookie('admin_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    if (result.require2fa) {
      return {
        require2fa: true,
        message: 'Two-factor authentication is required',
      };
    }

    return {
      require2fa: false,
      message: 'Login successful',
      session: result.session,
    };
  }

  @Post('verify-2fa')
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
      message: '2FA verified successfully',
      session,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['admin_session'];
    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('admin_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
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
}
