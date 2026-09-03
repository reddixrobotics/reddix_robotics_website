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
exports.AdminContactController = exports.PublicContactController = void 0;
const common_1 = require("@nestjs/common");
const contact_service_1 = require("./contact.service");
const contact_dto_1 = require("./dto/contact.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicContactController = class PublicContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    async create(createContactMessageDto) {
        return this.contactService.create(createContactMessageDto);
    }
};
exports.PublicContactController = PublicContactController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.CreateContactMessageDto]),
    __metadata("design:returntype", Promise)
], PublicContactController.prototype, "create", null);
exports.PublicContactController = PublicContactController = __decorate([
    (0, common_1.Controller)('api/contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], PublicContactController);
let AdminContactController = class AdminContactController {
    contactService;
    auditLogService;
    constructor(contactService, auditLogService) {
        this.contactService = contactService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.contactService.findAll();
    }
    async findOne(id) {
        return this.contactService.findOne(id);
    }
    async updateStatus(id, updateStatusDto, session, ip, userAgent) {
        const message = await this.contactService.updateStatus(id, updateStatusDto.status);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_CONTACT_MESSAGE_STATUS', 'ContactMessage', id, ip, userAgent);
        return message;
    }
    async replyToMessage(id, replyDto, session, ip, userAgent) {
        const result = await this.contactService.replyToMessage(id, replyDto.message);
        await this.auditLogService.logAction(session.adminId, 'REPLY_CONTACT_MESSAGE', 'ContactMessage', id, ip, userAgent);
        return result;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.contactService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_CONTACT_MESSAGE', 'ContactMessage', id, ip, userAgent);
        return result;
    }
};
exports.AdminContactController = AdminContactController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminContactController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminContactController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contact_dto_1.UpdateContactMessageStatusDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContactController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contact_dto_1.ReplyContactMessageDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContactController.prototype, "replyToMessage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminContactController.prototype, "remove", null);
exports.AdminContactController = AdminContactController = __decorate([
    (0, common_1.Controller)('api/admin/contact'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [contact_service_1.ContactService,
        audit_log_service_1.AuditLogService])
], AdminContactController);
//# sourceMappingURL=contact.controller.js.map