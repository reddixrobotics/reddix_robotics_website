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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalProducts, totalOrders, applications, workshops, messages, pendingOrders] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.application.count(),
            this.prisma.workshop.count(),
            this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.ORDER_PLACED } })
        ]);
        const payments = await this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'SUCCESS' }
        });
        const rawRevenue = payments._sum.amount || 0;
        const revenue = rawRevenue;
        const today = new Date();
        const sevenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        const recentPayments = await this.prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: sevenMonthsAgo }
            },
            select: { amount: true, createdAt: true }
        });
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            revenueMap.set(`${monthNames[d.getMonth()]}`, 0);
        }
        recentPayments.forEach(payment => {
            const month = monthNames[payment.createdAt.getMonth()];
            if (revenueMap.has(month)) {
                revenueMap.set(month, (revenueMap.get(month) || 0) + payment.amount);
            }
        });
        const revenueData = Array.from(revenueMap.entries()).map(([name, rev]) => ({
            name,
            revenue: rev
        }));
        const recentOrders = await this.prisma.order.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });
        const recentApplications = await this.prisma.application.findMany({
            take: 2,
            orderBy: { createdAt: 'desc' }
        });
        const recentActivity = [
            ...recentOrders.map(o => ({
                id: `order-${o.id}`,
                type: 'order',
                message: `New order #${o.orderNumber} received${o.customer ? ` from ${o.customer.name}` : ''}.`,
                createdAt: o.createdAt
            })),
            ...recentApplications.map(a => ({
                id: `app-${a.id}`,
                type: 'application',
                message: `New application received from ${a.name}.`,
                createdAt: a.createdAt
            }))
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)
            .map(act => ({
            id: act.id,
            type: act.type,
            message: act.message,
            time: act.createdAt.toLocaleDateString()
        }));
        const orders = await this.prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
        });
        const formattedOrders = orders.map(o => ({
            id: o.orderNumber,
            customer: o.customer?.name || 'Guest',
            amount: o.totalAmount,
            date: o.createdAt.toISOString().split('T')[0],
            status: o.status
        }));
        return {
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                revenue,
                pendingOrders,
                applications,
                workshops,
                messages
            },
            revenueData,
            recentActivity,
            orders: formattedOrders
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map