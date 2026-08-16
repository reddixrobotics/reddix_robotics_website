import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionService } from '../user-session.service';
import { Request } from 'express';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly userSessionService: UserSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['user_session'];

    if (!token) {
      throw new UnauthorizedException('Authentication session missing');
    }

    const session = await this.userSessionService.verifySession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    if (session.authStatus !== 'AUTHENTICATED') {
      throw new UnauthorizedException('User not fully authenticated');
    }

    request['user'] = { id: session.userId };
    request['session'] = session;
    request['sessionToken'] = token;

    return true;
  }
}
