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
exports.AdminCareersController = exports.PublicCareersController = void 0;
const common_1 = require("@nestjs/common");
const careers_service_1 = require("./careers.service");
const job_dto_1 = require("./dto/job.dto");
const internship_dto_1 = require("./dto/internship.dto");
const application_dto_1 = require("./dto/application.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicCareersController = class PublicCareersController {
    careersService;
    constructor(careersService) {
        this.careersService = careersService;
    }
    async findAllJobs() {
        return this.careersService.findAllJobs(false);
    }
    async findOneJob(id) {
        return this.careersService.findOneJob(id);
    }
    async findAllInternships() {
        return this.careersService.findAllInternships(false);
    }
    async findOneInternship(id) {
        return this.careersService.findOneInternship(id);
    }
    async apply(createApplicationDto) {
        return this.careersService.createApplication(createApplicationDto);
    }
};
exports.PublicCareersController = PublicCareersController;
__decorate([
    (0, common_1.Get)('jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCareersController.prototype, "findAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCareersController.prototype, "findOneJob", null);
__decorate([
    (0, common_1.Get)('internships'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCareersController.prototype, "findAllInternships", null);
__decorate([
    (0, common_1.Get)('internships/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCareersController.prototype, "findOneInternship", null);
__decorate([
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], PublicCareersController.prototype, "apply", null);
exports.PublicCareersController = PublicCareersController = __decorate([
    (0, common_1.Controller)('api/careers'),
    __metadata("design:paramtypes", [careers_service_1.CareersService])
], PublicCareersController);
let AdminCareersController = class AdminCareersController {
    careersService;
    auditLogService;
    constructor(careersService, auditLogService) {
        this.careersService = careersService;
        this.auditLogService = auditLogService;
    }
    async findAllJobs() {
        return this.careersService.findAllJobs(true);
    }
    async findOneJob(id) {
        return this.careersService.findOneJob(id);
    }
    async createJob(createJobDto, session, ip, userAgent) {
        const job = await this.careersService.createJob(createJobDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_JOB', 'Job', job.id, ip, userAgent);
        return job;
    }
    async updateJob(id, updateJobDto, session, ip, userAgent) {
        const job = await this.careersService.updateJob(id, updateJobDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_JOB', 'Job', id, ip, userAgent);
        return job;
    }
    async removeJob(id, session, ip, userAgent) {
        const result = await this.careersService.removeJob(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_JOB', 'Job', id, ip, userAgent);
        return result;
    }
    async findAllInternships() {
        return this.careersService.findAllInternships(true);
    }
    async findOneInternship(id) {
        return this.careersService.findOneInternship(id);
    }
    async createInternship(createInternshipDto, session, ip, userAgent) {
        const internship = await this.careersService.createInternship(createInternshipDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_INTERNSHIP', 'Internship', internship.id, ip, userAgent);
        return internship;
    }
    async updateInternship(id, updateInternshipDto, session, ip, userAgent) {
        const internship = await this.careersService.updateInternship(id, updateInternshipDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_INTERNSHIP', 'Internship', id, ip, userAgent);
        return internship;
    }
    async removeInternship(id, session, ip, userAgent) {
        const result = await this.careersService.removeInternship(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_INTERNSHIP', 'Internship', id, ip, userAgent);
        return result;
    }
    async findAllApplications() {
        return this.careersService.findAllApplications();
    }
    async findOneApplication(id) {
        return this.careersService.findOneApplication(id);
    }
    async updateApplicationStatus(id, updateStatusDto, session, ip, userAgent) {
        const application = await this.careersService.updateApplicationStatus(id, updateStatusDto.status);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_APPLICATION_STATUS', 'Application', id, ip, userAgent);
        return application;
    }
};
exports.AdminCareersController = AdminCareersController;
__decorate([
    (0, common_1.Get)('jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findOneJob", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.CreateJobDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "createJob", null);
__decorate([
    (0, common_1.Patch)('jobs/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, job_dto_1.UpdateJobDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "removeJob", null);
__decorate([
    (0, common_1.Get)('internships'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findAllInternships", null);
__decorate([
    (0, common_1.Get)('internships/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findOneInternship", null);
__decorate([
    (0, common_1.Post)('internships'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [internship_dto_1.CreateInternshipDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "createInternship", null);
__decorate([
    (0, common_1.Patch)('internships/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, internship_dto_1.UpdateInternshipDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "updateInternship", null);
__decorate([
    (0, common_1.Delete)('internships/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "removeInternship", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findAllApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "findOneApplication", null);
__decorate([
    (0, common_1.Patch)('applications/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CAREER_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, application_dto_1.UpdateApplicationStatusDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminCareersController.prototype, "updateApplicationStatus", null);
exports.AdminCareersController = AdminCareersController = __decorate([
    (0, common_1.Controller)('api/admin/careers'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [careers_service_1.CareersService,
        audit_log_service_1.AuditLogService])
], AdminCareersController);
//# sourceMappingURL=careers.controller.js.map