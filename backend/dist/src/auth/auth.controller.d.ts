import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import type { SessionData } from './session.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserSessionService } from './user-session.service';
export declare class AuthController {
    private readonly authService;
    private readonly sessionService;
    private readonly userSessionService;
    private readonly prisma;
    constructor(authService: AuthService, sessionService: SessionService, userSessionService: UserSessionService, prisma: PrismaService);
    getSession(req: Request): Promise<{
        authenticated: boolean;
        session: SessionData;
        isTwoFactorSetup: boolean;
        authStatus: "PENDING_EMAIL_OTP" | "PENDING_AUTHENTICATOR" | "AUTHENTICATED";
        role: string;
    } | {
        authenticated: boolean;
        session: import("./user-session.service").UserSessionData;
        authStatus: "AUTHENTICATED";
        role: string;
        isTwoFactorSetup?: undefined;
    } | {
        authenticated: boolean;
        session?: undefined;
        isTwoFactorSetup?: undefined;
        authStatus?: undefined;
        role?: undefined;
    }>;
    getProfile(session: SessionData): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.AdminRole;
        twoFactorEnabled: boolean;
    }>;
    signup(signupDto: SignupDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto, ip: string, userAgent: string, res: Response): Promise<{
        requireEmailOtp: boolean;
        isTwoFactorSetup: boolean | undefined;
        message: string;
        role: string;
        session?: undefined;
    } | {
        requireEmailOtp: boolean;
        message: string;
        session: SessionData | import("./user-session.service").UserSessionData;
        role: string;
        isTwoFactorSetup?: undefined;
    }>;
    verifyEmailOtp(otp: string, req: Request): Promise<{
        success: boolean;
        message: string;
        session: SessionData;
        isTwoFactorSetup: boolean;
    }>;
    resendEmailOtp(req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    verify2fa(verify2faDto: Verify2faDto, req: Request, ip: string, userAgent: string): Promise<{
        success: boolean;
        message: string;
        session: SessionData;
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
    getUserProfile(req: Request): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        role: "USER";
        phone: string | null;
    }>;
    getUserApplications(req: Request): Promise<{
        applications: ({
            job: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                status: import("@prisma/client").$Enums.CareerStatus;
                title: string;
                department: string;
                location: string;
                experienceLevel: string;
                salary: string | null;
                requirements: string[];
                responsibilities: string[];
            } | null;
            internship: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                type: string | null;
                status: import("@prisma/client").$Enums.CareerStatus;
                title: string;
                department: string;
                location: string | null;
                requirements: string[];
                company: string | null;
                duration: string;
                stipend: string | null;
                skills: string[];
                applicationLink: string | null;
                imageUrl: string | null;
                deadline: Date | null;
            } | null;
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            type: import("@prisma/client").$Enums.ApplicationType;
            phone: string;
            jobId: string | null;
            internshipId: string | null;
            resumeUrl: string;
            coverLetter: string | null;
            status: import("@prisma/client").$Enums.ApplicationStatus;
        })[];
        registrations: ({
            workshop: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                status: import("@prisma/client").$Enums.WorkshopStatus;
                title: string;
                location: string;
                duration: string;
                time: string;
                capacity: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            workshopId: string;
        })[];
    }>;
}
