import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionData } from '../session.service';

export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionData => {
    const request = ctx.switchToHttp().getRequest();
    return request['session'];
  },
);

export const CurrentSessionToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request['sessionToken'];
  },
);
