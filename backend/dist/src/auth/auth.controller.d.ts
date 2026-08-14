import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    private readonly sessionService;
    constructor(authService: AuthService, sessionService: SessionService);
    getSession(req: Request): Promise<{
        authenticated: boolean;
        session?: undefined;
    } | {
        authenticated: boolean;
        session: import("./session.service").SessionData;
    }>;
    login(loginDto: LoginDto, ip: string, userAgent: string, res: Response): Promise<{
        require2fa: boolean;
        message: string;
        session?: undefined;
    } | {
        require2fa: boolean;
        message: string;
        session: import("./session.service").SessionData;
    }>;
    verify2fa(verify2faDto: Verify2faDto, req: Request, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        session: import("./session.service").SessionData;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
