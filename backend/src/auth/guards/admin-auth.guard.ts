import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../session.service';
import { UserSessionService } from '../user-session.service';
import { Request } from 'express';
import { IS_ALLOW_PENDING_2FA_KEY } from '../decorators/allow-pending-2fa.decorator';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userSessionService: UserSessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const adminToken = request.cookies['admin_session'];
    const userToken = request.cookies['user_session'];

    if (!adminToken && !userToken) {
      throw new UnauthorizedException('Authentication session missing');
    }

    // If user is authenticated but doesn't have an admin session
    if (userToken && !adminToken) {
      const userSession = await this.userSessionService.verifySession(userToken);
      if (userSession) {
        throw new ForbiddenException('You do not have permission to access the admin area');
      } else {
        throw new UnauthorizedException('Invalid or expired session');
      }
    }

    const session = await this.sessionService.verifySession(adminToken);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Block standard routes if not fully authenticated
    const isAllowPending2FA = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOW_PENDING_2FA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (session.authStatus === 'PENDING_EMAIL_OTP') {
      throw new UnauthorizedException('Email verification required');
    }

    if (session.authStatus === 'PENDING_AUTHENTICATOR' && !isAllowPending2FA) {
      throw new UnauthorizedException('Two-factor authentication required');
    }

    // Attach session to request for downstream use in controllers
    request['session'] = session;
    request['sessionToken'] = adminToken; // Store token if needed to invalidate current session

    return true;
  }
}
