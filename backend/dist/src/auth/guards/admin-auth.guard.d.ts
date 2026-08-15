import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../session.service';
export declare class AdminAuthGuard implements CanActivate {
    private readonly sessionService;
    private readonly reflector;
    constructor(sessionService: SessionService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
