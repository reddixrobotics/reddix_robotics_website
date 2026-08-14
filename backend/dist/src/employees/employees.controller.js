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
exports.AdminEmployeesController = exports.PublicEmployeesController = void 0;
const common_1 = require("@nestjs/common");
const employees_service_1 = require("./employees.service");
const employee_dto_1 = require("./dto/employee.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PublicEmployeesController = class PublicEmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async findAll() {
        return this.employeesService.findAll();
    }
};
exports.PublicEmployeesController = PublicEmployeesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicEmployeesController.prototype, "findAll", null);
exports.PublicEmployeesController = PublicEmployeesController = __decorate([
    (0, common_1.Controller)('api/employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], PublicEmployeesController);
let AdminEmployeesController = class AdminEmployeesController {
    employeesService;
    auditLogService;
    constructor(employeesService, auditLogService) {
        this.employeesService = employeesService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.employeesService.findAll();
    }
    async findOne(id) {
        return this.employeesService.findOne(id);
    }
    async create(createEmployeeDto, session, ip, userAgent) {
        const employee = await this.employeesService.create(createEmployeeDto);
        await this.auditLogService.logAction(session.adminId, 'CREATE_EMPLOYEE', 'Employee', employee.id, ip, userAgent);
        return employee;
    }
    async update(id, updateEmployeeDto, session, ip, userAgent) {
        const employee = await this.employeesService.update(id, updateEmployeeDto);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_EMPLOYEE', 'Employee', id, ip, userAgent);
        return employee;
    }
    async remove(id, session, ip, userAgent) {
        const result = await this.employeesService.remove(id);
        await this.auditLogService.logAction(session.adminId, 'DELETE_EMPLOYEE', 'Employee', id, ip, userAgent);
        return result;
    }
};
exports.AdminEmployeesController = AdminEmployeesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminEmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminEmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminEmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.UpdateEmployeeDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminEmployeesController.prototype, "update", null);
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
], AdminEmployeesController.prototype, "remove", null);
exports.AdminEmployeesController = AdminEmployeesController = __decorate([
    (0, common_1.Controller)('api/admin/employees'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService,
        audit_log_service_1.AuditLogService])
], AdminEmployeesController);
//# sourceMappingURL=employees.controller.js.map