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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${dto.orderId} not found`);
        }
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    orderId: dto.orderId,
                    amount: dto.amount,
                    transactionId: dto.transactionId,
                    status: dto.status,
                    type: dto.type,
                    paymentMethod: dto.paymentMethod,
                },
            });
            if (dto.status.toUpperCase() === 'SUCCESS') {
                let orderPaymentStatus = order.paymentStatus;
                if (dto.type === 'ADVANCE') {
                    orderPaymentStatus = client_1.PaymentStatus.PARTIALLY_PAID;
                }
                else if (dto.type === 'BALANCE') {
                    orderPaymentStatus = client_1.PaymentStatus.FULLY_PAID;
                }
                await tx.order.update({
                    where: { id: dto.orderId },
                    data: { paymentStatus: orderPaymentStatus },
                });
            }
            return payment;
        });
    }
    async findAll() {
        return this.prisma.payment.findMany({
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment record ${id} not found`);
        }
        return payment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map