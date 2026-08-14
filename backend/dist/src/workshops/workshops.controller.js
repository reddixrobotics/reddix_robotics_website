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
exports.AdminWorkshopsController = exports.PublicWorkshopsController = void 0;
const common_1 = require("@nestjs/common");
const workshops_service_1 = require("./workshops.service");
const workshop_dto_1 = require("./dto/workshop.dto");
const registration_dto_1 = require("./dto/registration.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicWorkshopsController = class PublicWorkshopsController {
    workshopsService;
    constructor(workshopsService) {
        this.workshopsService = workshopsService;
    }
    async findAll() {
        return this.workshopsService.findAllWorkshops(false);
    }
    async findOne(id) {
        return this.workshopsService.findOneWorkshop(id);
    }
    async register(createRegistrationDto) {
        return this.workshopsService.register(createRegistrationDto);
    }
};
exports.PublicWorkshopsController = PublicWorkshopsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicWorkshopsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicWorkshopsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registration_dto_1.CreateRegistrationDto]),
    __metadata("design:returntype", Promise)
], PublicWorkshopsController.prototype, "register", null);
exports.PublicWorkshopsController = PublicWorkshopsController = __decorate([
    (0, common_1.Controller)('api/workshops'),
    __metadata("design:paramtypes", [workshops_service_1.WorkshopsService])
], PublicWorkshopsController);
let AdminWorkshopsController = class AdminWorkshopsController {
    workshopsService;
    auditLogService;
    constructor(workshopsService, auditLogService) {
        this.workshopsService = workshopsService;
        this.auditLogService = auditLogService;
    }
    async findAllWorkshops() {
        return this.workshopsService.findAllWorkshops(true);
    }
    async findOneWorkshop(id) {
        return this.workshopsService.findOneWorkshop(id);
    }
    async createWorkshop(createWorkshopDto, session, ip, userAgent) {
        const workshop = await this.workshopsService.createWorkshop(createWorkshopDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_WORKSHOP', 'Workshop', workshop.id, ip, userAgent);
        return workshop;
    }
    async updateWorkshop(id, updateWorkshopDto, session, ip, userAgent) {
        const workshop = await this.workshopsService.updateWorkshop(id, updateWorkshopDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_WORKSHOP', 'Workshop', id, ip, userAgent);
        return workshop;
    }
    async removeWorkshop(id, session, ip, userAgent) {
        const result = await this.workshopsService.removeWorkshop(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_WORKSHOP', 'Workshop', id, ip, userAgent);
        return result;
    }
    async findAllRegistrations() {
        return this.workshopsService.findAllRegistrations();
    }
    async findOneRegistration(id) {
        return this.workshopsService.findOneRegistration(id);
    }
    async updateRegistrationStatus(id, updateStatusDto, session, ip, userAgent) {
        const registration = await this.workshopsService.updateRegistrationStatus(id, updateStatusDto.status);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_REGISTRATION_STATUS', 'WorkshopRegistration', id, ip, userAgent);
        return registration;
    }
};
exports.AdminWorkshopsController = AdminWorkshopsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "findAllWorkshops", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "findOneWorkshop", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [workshop_dto_1.CreateWorkshopDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "createWorkshop", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workshop_dto_1.UpdateWorkshopDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "updateWorkshop", null);
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
], AdminWorkshopsController.prototype, "removeWorkshop", null);
__decorate([
    (0, common_1.Get)('registrations'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "findAllRegistrations", null);
__decorate([
    (0, common_1.Get)('registrations/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "findOneRegistration", null);
__decorate([
    (0, common_1.Patch)('registrations/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, registration_dto_1.UpdateRegistrationStatusDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminWorkshopsController.prototype, "updateRegistrationStatus", null);
exports.AdminWorkshopsController = AdminWorkshopsController = __decorate([
    (0, common_1.Controller)('api/admin/workshops'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [workshops_service_1.WorkshopsService,
        audit_log_service_1.AuditLogService])
], AdminWorkshopsController);
//# sourceMappingURL=workshops.controller.js.map