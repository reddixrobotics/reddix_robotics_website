"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = __importStar(require("crypto"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    razorpay;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new razorpay_1.default({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }
        else {
            console.warn('Razorpay credentials not found in environment variables.');
        }
    }
    async createRazorpayOrder(orderId, userId) {
        if (!this.razorpay) {
            throw new common_1.BadRequestException('Razorpay is not configured on the server.');
        }
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payments: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.paymentStatus === 'FULLY_PAID') {
            throw new common_1.BadRequestException('Order is already fully paid');
        }
        let amountInCents = Math.round(order.advanceAmount * 100);
        if (amountInCents < 50) {
            amountInCents = 50;
        }
        if (amountInCents > 500000) {
            amountInCents = 500000;
        }
        const options = {
            amount: amountInCents,
            currency: 'USD',
            receipt: `rcpt_${order.orderNumber}`,
        };
        try {
            const razorpayOrder = await this.razorpay.orders.create(options);
            await this.prisma.payment.create({
                data: {
                    orderId: order.id,
                    amount: order.advanceAmount,
                    currency: 'USD',
                    razorpayOrderId: razorpayOrder.id,
                    status: 'PENDING',
                    type: 'ADVANCE',
                    paymentMethod: 'Razorpay',
                },
            });
            return {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
            };
        }
        catch (error) {
            console.error('Error creating Razorpay order:', error);
            const errorMsg = error?.error?.description || error?.message || 'Unknown Razorpay error';
            throw new common_1.BadRequestException(`Failed to create payment order: ${errorMsg}`);
        }
    }
    async verifyPayment(razorpayOrderId, razorpayPaymentId, signature) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            throw new common_1.BadRequestException('Razorpay secret not configured');
        }
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');
        if (expectedSignature !== signature) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        const payment = await this.prisma.payment.findUnique({
            where: { razorpayOrderId },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment record not found');
        }
        if (payment.status === 'SUCCESS') {
            return { success: true, message: 'Already verified' };
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'SUCCESS',
                    razorpayPaymentId: razorpayPaymentId,
                },
            });
            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    paymentStatus: 'PARTIALLY_PAID',
                },
            });
        });
        return { success: true, message: 'Payment verified successfully' };
    }
    async findAllAdmin() {
        return this.prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        customer: true,
                        items: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOneAdmin(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        customer: true,
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map