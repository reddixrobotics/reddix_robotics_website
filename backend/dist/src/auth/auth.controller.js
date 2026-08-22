"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const session_service_1 = require("./session.service");
const admin_auth_guard_1 = require("./guards/admin-auth.guard");
const user_auth_guard_1 = require("./guards/user-auth.guard");
const current_session_decorator_1 = require("./decorators/current-session.decorator");
const login_dto_1 = require("./dto/login.dto");
const signup_dto_1 = require("./dto/signup.dto");
const verify_2fa_dto_1 = require("./dto/verify-2fa.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const prisma_service_1 = require("../prisma/prisma.service");
const user_session_service_1 = require("./user-session.service");
let AuthController = class AuthController {
    authService;
    sessionService;
    userSessionService;
    prisma;
    constructor(authService, sessionService, userSessionService, prisma) {
        this.authService = authService;
        this.sessionService = sessionService;
        this.userSessionService = userSessionService;
        this.prisma = prisma;
    }
    async getSession(req) {
        const adminToken = req.cookies['admin_session'];
        const userToken = req.cookies['user_session'];
        if (adminToken) {
            const session = await this.sessionService.verifySession(adminToken);
            if (session) {
                const admin = await this.prisma.admin.findUnique({
                    where: { id: session.adminId },
                    select: { twoFactorEnabled: true }
                });
                return {
                    authenticated: true,
                    session,
                    isTwoFactorSetup: admin?.twoFactorEnabled || false,
                    authStatus: session.authStatus,
                    role: session.role,
                };
            }
        }
        if (userToken) {
            const session = await this.userSessionService.verifySession(userToken);
            if (session) {
                return {
                    authenticated: true,
                    session,
                    authStatus: session.authStatus,
                    role: session.role,
                };
            }
        }
        return { authenticated: false };
    }
    async getProfile(session) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: session.adminId },
            select: {
                id: true,
                email: true,
                role: true,
                twoFactorEnabled: true,
                createdAt: true,
            },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Administrator not found');
        }
        return admin;
    }
    async signup(signupDto) {
        return this.authService.signup(signupDto.name, signupDto.email, signupDto.password, signupDto.phone);
    }
    async login(loginDto, ip, userAgent, res) {
        const result = await this.authService.login(loginDto.email, loginDto.password, ip, userAgent);
        const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER'];
        if (adminRoles.includes(result.role)) {
            res.cookie('admin_session', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            if (result.requireEmailOtp) {
                return {
                    requireEmailOtp: true,
                    isTwoFactorSetup: result.isTwoFactorSetup,
                    message: 'Email verification is required',
                    role: result.role,
                };
            }
        }
        else if (result.role === 'USER') {
            res.cookie('user_session', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
        }
        return {
            requireEmailOtp: false,
            message: 'Login successful',
            session: result.session,
            role: result.role,
        };
    }
    async verifyEmailOtp(otp, req) {
        const token = req.cookies['admin_session'];
        if (!token) {
            throw new common_1.UnauthorizedException('No active session found');
        }
        const session = await this.authService.verifyEmailOtp(token, otp);
        const admin = await this.prisma.admin.findUnique({
            where: { id: session.adminId },
            select: { twoFactorEnabled: true }
        });
        return {
            success: true,
            message: 'Email OTP verified',
            session,
            isTwoFactorSetup: admin?.twoFactorEnabled || false,
        };
    }
    async resendEmailOtp(req) {
        const token = req.cookies['admin_session'];
        if (!token) {
            throw new common_1.UnauthorizedException('No active session found');
        }
        await this.authService.resendEmailOtp(token);
        return {
            success: true,
            message: 'Email OTP resent',
        };
    }
    async verify2fa(verify2faDto, req, ip, userAgent) {
        const token = req.cookies['admin_session'];
        if (!token) {
            throw new common_1.UnauthorizedException('No active session found');
        }
        const session = await this.authService.verify2fa(token, verify2faDto.token, ip, userAgent);
        return {
            success: true,
            message: 'Authentication successful',
            session,
        };
    }
    async logout(req, res) {
        const adminToken = req.cookies['admin_session'];
        if (adminToken) {
            await this.authService.logout(adminToken);
            res.clearCookie('admin_session', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        const userToken = req.cookies['user_session'];
        if (userToken) {
            await this.authService.logoutUser(userToken);
            res.clearCookie('user_session', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }
    async getUserProfile(req) {
        const userId = req.user.id;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async getUserApplications(req) {
        const userId = req.user.id;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const [applications, registrations] = await Promise.all([
            this.prisma.application.findMany({
                where: { email: user.email },
                include: { job: true, internship: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.workshopRegistration.findMany({
                where: { email: user.email },
                include: { workshop: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return { applications, registrations };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('session'),
    (0, throttler_1.SkipThrottle)({ default: true, global: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, throttler_1.Throttle)({ default: { ttl: 60_000, limit: 3 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { ttl: 120_000, limit: 8 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-email-otp'),
    (0, throttler_1.Throttle)({ default: { ttl: 300_000, limit: 5 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('otp')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmailOtp", null);
__decorate([
    (0, common_1.Post)('resend-email-otp'),
    (0, throttler_1.Throttle)({ default: { ttl: 300_000, limit: 3 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendEmailOtp", null);
__decorate([
    (0, common_1.Post)('verify-2fa'),
    (0, throttler_1.Throttle)({ default: { ttl: 300_000, limit: 5 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_2fa_dto_1.Verify2faDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2fa", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, throttler_1.Throttle)({ default: { ttl: 600_000, limit: 3 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('user/profile'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('user/applications'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserApplications", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        session_service_1.SessionService,
        user_session_service_1.UserSessionService,
        prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map