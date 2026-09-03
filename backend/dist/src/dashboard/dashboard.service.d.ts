import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        stats: {
            totalUsers: number;
            totalProducts: number;
            totalOrders: number;
            revenue: number;
            pendingOrders: number;
            applications: number;
            workshops: number;
            messages: number;
        };
        revenueData: {
            name: string;
            revenue: number;
        }[];
        recentActivity: {
            id: string;
            type: string;
            message: string;
            time: string;
        }[];
        orders: {
            id: string;
            customer: string;
            amount: number;
            date: string;
            status: import("@prisma/client").$Enums.OrderStatus;
        }[];
    }>;
}
