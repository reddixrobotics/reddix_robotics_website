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
const auth_service_1 = require("./auth.service");
const session_service_1 = require("./session.service");
const login_dto_1 = require("./dto/login.dto");
const verify_2fa_dto_1 = require("./dto/verify-2fa.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let AuthController = class AuthController {
    authService;
    sessionService;
    constructor(authService, sessionService) {
        this.authService = authService;
        this.sessionService = sessionService;
    }
    async getSession(req) {
        const token = req.cookies['admin_session'];
        if (!token) {
            return { authenticated: false };
        }
        const session = await this.sessionService.verifySession(token);
        if (!session) {
            return { authenticated: false };
        }
        return {
            authenticated: true,
            session,
        };
    }
    async login(loginDto, ip, userAgent, res) {
        const result = await this.authService.login(loginDto.email, loginDto.password, ip, userAgent);
        res.cookie('admin_session', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        if (result.require2fa) {
            return {
                require2fa: true,
                message: 'Two-factor authentication is required',
            };
        }
        return {
            require2fa: false,
            message: 'Login successful',
            session: result.session,
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
            message: '2FA verified successfully',
            session,
        };
    }
    async logout(req, res) {
        const token = req.cookies['admin_session'];
        if (token) {
            await this.authService.logout(token);
        }
        res.clearCookie('admin_session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('session'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('login'),
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
    (0, common_1.Post)('verify-2fa'),
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
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/admin/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        session_service_1.SessionService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map