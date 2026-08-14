import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../session.service';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['admin_session'];

    if (!token) {
      throw new UnauthorizedException('Authentication session missing');
    }

    const session = await this.sessionService.verifySession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Block standard routes if 2FA is required but not verified
    if (session.needs2fa) {
      throw new UnauthorizedException('Two-factor authentication required');
    }

    // Attach session to request for downstream use in controllers
    request['session'] = session;
    request['sessionToken'] = token; // Store token if needed to invalidate current session

    return true;
  }
}
