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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const session_service_1 = require("../session.service");
const allow_pending_2fa_decorator_1 = require("../decorators/allow-pending-2fa.decorator");
let AdminAuthGuard = class AdminAuthGuard {
    sessionService;
    reflector;
    constructor(sessionService, reflector) {
        this.sessionService = sessionService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['admin_session'];
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication session missing');
        }
        const session = await this.sessionService.verifySession(token);
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid or expired session');
        }
        const isAllowPending2FA = this.reflector.getAllAndOverride(allow_pending_2fa_decorator_1.IS_ALLOW_PENDING_2FA_KEY, [context.getHandler(), context.getClass()]);
        if (session.authStatus === 'PENDING_EMAIL_OTP') {
            throw new common_1.UnauthorizedException('Email verification required');
        }
        if (session.authStatus === 'PENDING_AUTHENTICATOR' && !isAllowPending2FA) {
            throw new common_1.UnauthorizedException('Two-factor authentication required');
        }
        request['session'] = session;
        request['sessionToken'] = token;
        return true;
    }
};
exports.AdminAuthGuard = AdminAuthGuard;
exports.AdminAuthGuard = AdminAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        core_1.Reflector])
], AdminAuthGuard);
//# sourceMappingURL=admin-auth.guard.js.map