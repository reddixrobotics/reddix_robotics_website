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
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const security_service_1 = require("./security.service");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const allow_pending_2fa_decorator_1 = require("../auth/decorators/allow-pending-2fa.decorator");
const verify_totp_setup_dto_1 = require("./dto/verify-totp-setup.dto");
const disable_totp_dto_1 = require("./dto/disable-totp.dto");
let SecurityController = class SecurityController {
    securityService;
    constructor(securityService) {
        this.securityService = securityService;
    }
    async setup2fa(session) {
        return this.securityService.setup2fa(session.adminId);
    }
    async verify2faSetup(session, token, verifyTotpSetupDto) {
        return this.securityService.verify2faSetup(session.adminId, verifyTotpSetupDto.token, token);
    }
    async disable2fa(session, disableTotpDto) {
        return this.securityService.disable2fa(session.adminId, disableTotpDto.code);
    }
    async listActiveSessions(session, token) {
        return this.securityService.listActiveSessions(session.adminId, token);
    }
    async terminateSession(session, sessionId) {
        await this.securityService.terminateSession(session.adminId, sessionId);
        return { message: 'Session terminated successfully.' };
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Post)('2fa/setup'),
    (0, allow_pending_2fa_decorator_1.AllowPending2FA)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "setup2fa", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, allow_pending_2fa_decorator_1.AllowPending2FA)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __param(1, (0, current_session_decorator_1.CurrentSessionToken)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, verify_totp_setup_dto_1.VerifyTotpSetupDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "verify2faSetup", null);
__decorate([
    (0, common_1.Post)('2fa/disable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, disable_totp_dto_1.DisableTotpDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "disable2fa", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __param(1, (0, current_session_decorator_1.CurrentSessionToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "listActiveSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_session_decorator_1.CurrentSession)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "terminateSession", null);
exports.SecurityController = SecurityController = __decorate([
    (0, common_1.Controller)('api/admin/security'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __metadata("design:paramtypes", [security_service_1.SecurityService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map