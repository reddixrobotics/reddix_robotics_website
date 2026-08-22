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
const user_auth_guard_1 = require("../auth/guards/user-auth.guard");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createOrder(req, orderId) {
        return this.paymentsService.createRazorpayOrder(orderId, req.user.id);
    }
    async verifyPayment(razorpayOrderId, razorpayPaymentId, signature) {
        return this.paymentsService.verifyPayment(razorpayOrderId, razorpayPaymentId, signature);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-order'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UseGuards)(user_auth_guard_1.UserAuthGuard),
    __param(0, (0, common_1.Body)('razorpay_order_id')),
    __param(1, (0, common_1.Body)('razorpay_payment_id')),
    __param(2, (0, common_1.Body)('razorpay_signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('api/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map