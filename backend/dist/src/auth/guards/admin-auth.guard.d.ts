import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../session.service';
import { UserSessionService } from '../user-session.service';
export declare class AdminAuthGuard implements CanActivate {
    private readonly sessionService;
    private readonly userSessionService;
    private readonly reflector;
    constructor(sessionService: SessionService, userSessionService: UserSessionService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
