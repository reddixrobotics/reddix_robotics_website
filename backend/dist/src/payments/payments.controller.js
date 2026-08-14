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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    auditLogService;
    constructor(paymentsService, auditLogService) {
        this.paymentsService = paymentsService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.paymentsService.findAll();
    }
    async findOne(id) {
        return this.paymentsService.findOne(id);
    }
    async create(createPaymentDto, session, ip, userAgent) {
        const payment = await this.paymentsService.create(createPaymentDto);
        await this.auditLogService.logAction(session.adminId, 'RECORD_PAYMENT', 'Payment', payment.id, ip, userAgent);
        return payment;
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.ORDER_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('api/admin/payments'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        audit_log_service_1.AuditLogService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map