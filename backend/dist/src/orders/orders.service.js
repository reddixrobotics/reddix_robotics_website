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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const itemRecords = [];
        let subtotal = 0;
        let advanceAmount = 0;
        for (const item of dto.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (!product.availability) {
                throw new common_1.BadRequestException(`Product ${product.name} is currently unavailable`);
            }
            const itemPrice = product.price;
            const depositPercentage = product.depositPercentage ?? 50;
            const itemDeposit = itemPrice * (depositPercentage / 100);
            subtotal += itemPrice * item.quantity;
            advanceAmount += itemDeposit * item.quantity;
            itemRecords.push({
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice,
                depositAmount: itemDeposit,
            });
        }
        const totalAmount = subtotal;
        const remainingAmount = totalAmount - advanceAmount;
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerId: dto.customerId || null,
                    subtotal,
                    totalAmount,
                    advanceAmount,
                    remainingAmount,
                    status: client_1.OrderStatus.ORDER_PLACED,
                    paymentStatus: 'PENDING',
                    shippingDetails: dto.shippingDetails || null,
                },
            });
            await tx.orderItem.createMany({
                data: itemRecords.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });
            return tx.order.findUnique({
                where: { id: order.id },
                include: {
                    items: {
                        include: { product: true },
                    },
                    customer: true,
                },
            });
        });
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
                shipment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.order.findMany({
            where: { customerId: userId },
            include: {
                items: {
                    include: { product: { include: { images: true } } },
                },
                shipment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
                payments: true,
                shipment: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
                shipment: true,
            },
        });
    }
    async createShipment(orderId, courier = 'DELHIVERY') {
        const order = await this.findOne(orderId);
        if (order.shipment) {
            throw new common_1.BadRequestException('Shipment already exists for this order');
        }
        return this.prisma.shipment.create({
            data: {
                orderId,
                courier,
                status: client_1.ShipmentStatus.CREATED,
            },
        });
    }
    async updateShipment(orderId, data) {
        const shipment = await this.prisma.shipment.findUnique({
            where: { orderId },
        });
        if (!shipment) {
            throw new common_1.NotFoundException('Shipment not found for this order. Create it first.');
        }
        return this.prisma.shipment.update({
            where: { orderId },
            data: {
                awbNumber: data.awbNumber || undefined,
                trackingUrl: data.trackingUrl || undefined,
                status: data.status || undefined,
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map