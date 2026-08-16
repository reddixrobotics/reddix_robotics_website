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
exports.AdminJourneysController = exports.PublicJourneysController = void 0;
const common_1 = require("@nestjs/common");
const journeys_service_1 = require("./journeys.service");
const journey_dto_1 = require("./dto/journey.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicJourneysController = class PublicJourneysController {
    journeysService;
    constructor(journeysService) {
        this.journeysService = journeysService;
    }
    async findAll() {
        return this.journeysService.findAll();
    }
};
exports.PublicJourneysController = PublicJourneysController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicJourneysController.prototype, "findAll", null);
exports.PublicJourneysController = PublicJourneysController = __decorate([
    (0, common_1.Controller)('api/journeys'),
    __metadata("design:paramtypes", [journeys_service_1.JourneysService])
], PublicJourneysController);
let AdminJourneysController = class AdminJourneysController {
    journeysService;
    auditLogService;
    constructor(journeysService, auditLogService) {
        this.journeysService = journeysService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.journeysService.findAll();
    }
    async findOne(id) {
        return this.journeysService.findOne(id);
    }
    async create(createJourneyDto, session, ip, userAgent) {
        const journey = await this.journeysService.create(createJourneyDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_JOURNEY', 'Journey', journey.id, ip, userAgent);
        return journey;
    }
    async update(id, updateJourneyDto, session, ip, userAgent) {
        const journey = await this.journeysService.update(id, updateJourneyDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_JOURNEY', 'Journey', id, ip, userAgent);
        return journey;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.journeysService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_JOURNEY', 'Journey', id, ip, userAgent);
        return result;
    }
};
exports.AdminJourneysController = AdminJourneysController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminJourneysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminJourneysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [journey_dto_1.CreateJourneyDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminJourneysController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, journey_dto_1.UpdateJourneyDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminJourneysController.prototype, "update", null);
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
], AdminJourneysController.prototype, "remove", null);
exports.AdminJourneysController = AdminJourneysController = __decorate([
    (0, common_1.Controller)('api/admin/journeys'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [journeys_service_1.JourneysService,
        audit_log_service_1.AuditLogService])
], AdminJourneysController);
//# sourceMappingURL=journeys.controller.js.map