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
exports.AdminContractorsController = exports.PublicContractorsController = void 0;
const common_1 = require("@nestjs/common");
const contractors_service_1 = require("./contractors.service");
const contractor_dto_1 = require("./dto/contractor.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicContractorsController = class PublicContractorsController {
    contractorsService;
    constructor(contractorsService) {
        this.contractorsService = contractorsService;
    }
    async findAll() {
        return this.contractorsService.findAll();
    }
};
exports.PublicContractorsController = PublicContractorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicContractorsController.prototype, "findAll", null);
exports.PublicContractorsController = PublicContractorsController = __decorate([
    (0, common_1.Controller)('api/contractors'),
    __metadata("design:paramtypes", [contractors_service_1.ContractorsService])
], PublicContractorsController);
let AdminContractorsController = class AdminContractorsController {
    contractorsService;
    auditLogService;
    constructor(contractorsService, auditLogService) {
        this.contractorsService = contractorsService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.contractorsService.findAll();
    }
    async findOne(id) {
        return this.contractorsService.findOne(id);
    }
    async create(createContractorDto, session, ip, userAgent) {
        const contractor = await this.contractorsService.create(createContractorDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_CONTRACTOR', 'Contractor', contractor.id, ip, userAgent);
        return contractor;
    }
    async update(id, updateContractorDto, session, ip, userAgent) {
        const contractor = await this.contractorsService.update(id, updateContractorDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_CONTRACTOR', 'Contractor', id, ip, userAgent);
        return contractor;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.contractorsService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_CONTRACTOR', 'Contractor', id, ip, userAgent);
        return result;
    }
};
exports.AdminContractorsController = AdminContractorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContractorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContractorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contractor_dto_1.CreateContractorDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContractorsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contractor_dto_1.UpdateContractorDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContractorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContractorsController.prototype, "remove", null);
exports.AdminContractorsController = AdminContractorsController = __decorate([
    (0, common_1.Controller)('api/admin/contractors'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [contractors_service_1.ContractorsService,
        audit_log_service_1.AuditLogService])
], AdminContractorsController);
//# sourceMappingURL=contractors.controller.js.map