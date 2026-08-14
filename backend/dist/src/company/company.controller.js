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
exports.AdminCompanyController = exports.PublicCompanyController = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("./company.service");
const company_dto_1 = require("./dto/company.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicCompanyController = class PublicCompanyController {
    companyService;
    constructor(companyService) {
        this.companyService = companyService;
    }
    async getInfo() {
        return this.companyService.getInfo();
    }
};
exports.PublicCompanyController = PublicCompanyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCompanyController.prototype, "getInfo", null);
exports.PublicCompanyController = PublicCompanyController = __decorate([
    (0, common_1.Controller)('api/company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], PublicCompanyController);
let AdminCompanyController = class AdminCompanyController {
    companyService;
    auditLogService;
    constructor(companyService, auditLogService) {
        this.companyService = companyService;
        this.auditLogService = auditLogService;
    }
    async getInfo() {
        return this.companyService.getInfo();
    }
    async update(updateDto, session, ip, userAgent) {
        const info = await this.companyService.updateInfo(updateDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_COMPANY_INFO', 'CompanyInformation', info.id, ip, userAgent);
        return info;
    }
};
exports.AdminCompanyController = AdminCompanyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCompanyController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.UpdateCompanyInfoDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCompanyController.prototype, "update", null);
exports.AdminCompanyController = AdminCompanyController = __decorate([
    (0, common_1.Controller)('api/admin/company'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [company_service_1.CompanyService,
        audit_log_service_1.AuditLogService])
], AdminCompanyController);
//# sourceMappingURL=company.controller.js.map