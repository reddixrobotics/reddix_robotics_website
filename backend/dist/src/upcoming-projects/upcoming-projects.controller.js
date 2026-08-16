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
exports.AdminUpcomingProjectsController = exports.PublicUpcomingProjectsController = void 0;
const common_1 = require("@nestjs/common");
const upcoming_projects_service_1 = require("./upcoming-projects.service");
const upcoming_project_dto_1 = require("./dto/upcoming-project.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicUpcomingProjectsController = class PublicUpcomingProjectsController {
    upcomingProjectsService;
    constructor(upcomingProjectsService) {
        this.upcomingProjectsService = upcomingProjectsService;
    }
    async findAll() {
        return this.upcomingProjectsService.findAll();
    }
    async findOne(id) {
        return this.upcomingProjectsService.findOne(id);
    }
};
exports.PublicUpcomingProjectsController = PublicUpcomingProjectsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicUpcomingProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicUpcomingProjectsController.prototype, "findOne", null);
exports.PublicUpcomingProjectsController = PublicUpcomingProjectsController = __decorate([
    (0, common_1.Controller)('api/upcoming-projects'),
    __metadata("design:paramtypes", [upcoming_projects_service_1.UpcomingProjectsService])
], PublicUpcomingProjectsController);
let AdminUpcomingProjectsController = class AdminUpcomingProjectsController {
    upcomingProjectsService;
    auditLogService;
    constructor(upcomingProjectsService, auditLogService) {
        this.upcomingProjectsService = upcomingProjectsService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.upcomingProjectsService.findAll();
    }
    async findOne(id) {
        return this.upcomingProjectsService.findOne(id);
    }
    async create(createDto, session, ip, userAgent) {
        const project = await this.upcomingProjectsService.create(createDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_UPCOMING_PROJECT', 'UpcomingProject', project.id, ip, userAgent);
        return project;
    }
    async update(id, updateDto, session, ip, userAgent) {
        const project = await this.upcomingProjectsService.update(id, updateDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_UPCOMING_PROJECT', 'UpcomingProject', project.id, ip, userAgent);
        return project;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.upcomingProjectsService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_UPCOMING_PROJECT', 'UpcomingProject', id, ip, userAgent);
        return result;
    }
};
exports.AdminUpcomingProjectsController = AdminUpcomingProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUpcomingProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUpcomingProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upcoming_project_dto_1.CreateUpcomingProjectDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminUpcomingProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upcoming_project_dto_1.UpdateUpcomingProjectDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminUpcomingProjectsController.prototype, "update", null);
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
], AdminUpcomingProjectsController.prototype, "remove", null);
exports.AdminUpcomingProjectsController = AdminUpcomingProjectsController = __decorate([
    (0, common_1.Controller)('api/admin/upcoming-projects'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [upcoming_projects_service_1.UpcomingProjectsService,
        audit_log_service_1.AuditLogService])
], AdminUpcomingProjectsController);
//# sourceMappingURL=upcoming-projects.controller.js.map