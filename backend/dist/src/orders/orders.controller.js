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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_session_decorator_1 = require("../auth/decorators/current-session.decorator");
const audit_log_service_1 = require("../audit/audit-log.service");
const update_shipment_dto_1 = require("./dto/update-shipment.dto");
let OrdersController = class OrdersController {
    ordersService;
    auditLogService;
    constructor(ordersService, auditLogService) {
        this.ordersService = ordersService;
        this.auditLogService = auditLogService;
    }
    async findAll() {
        return this.ordersService.findAll();
    }
    async findOne(id) {
        return this.ordersService.findOne(id);
    }
    async create(createOrderDto, session, ip, userAgent) {
        const order = await this.ordersService.create(createOrderDto);
        if (!order) {
            throw new common_1.BadRequestException('Order could not be created');
        }
        await this.auditLogService.logAction(session.adminId, 'CREATE_ORDER', 'Order', order.id, ip, userAgent);
        return order;
    }
    async updateStatus(id, updateOrderStatusDto, session, ip, userAgent) {
        const order = await this.ordersService.updateStatus(id, updateOrderStatusDto.status);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_ORDER_STATUS', 'Order', id, ip, userAgent);
        return order;
    }
    async createShipment(id, body, session, ip, userAgent) {
        const shipment = await this.ordersService.createShipment(id, body.courier);
        await this.auditLogService.logAction(session.adminId, 'CREATE_SHIPMENT', 'Shipment', shipment.id, ip, userAgent);
        return shipment;
    }
    async updateShipment(id, body, session, ip, userAgent) {
        const shipment = await this.ordersService.updateShipment(id, body);
        await this.auditLogService.logAction(session.adminId, 'UPDATE_SHIPMENT', 'Shipment', shipment.id, ip, userAgent);
        return shipment;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.ORDER_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_session_decorator_1.CurrentSession)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.ORDER_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/shipment'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.ORDER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createShipment", null);
__decorate([
    (0, common_1.Patch)(':id/shipment'),
    (0, roles_decorator_1.Roles)(client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.ADMIN, client_1.AdminRole.ORDER_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_session_decorator_1.CurrentSession)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_shipment_dto_1.UpdateShipmentDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateShipment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('api/admin/orders'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        audit_log_service_1.AuditLogService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map