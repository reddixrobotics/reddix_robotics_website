import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserSessionService } from '../user-session.service';
export declare class UserAuthGuard implements CanActivate {
    private readonly userSessionService;
    constructor(userSessionService: UserSessionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
