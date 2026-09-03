import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      applications,
      workshops,
      messages,
      pendingOrders
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.application.count(),
      this.prisma.workshop.count(),
      this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
      this.prisma.order.count({ where: { status: OrderStatus.ORDER_PLACED } })
    ]);

    // Calculate total revenue from successful payments
    const payments = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' }
    });
    
    // In case there are no successful payments, default to 0
    const rawRevenue = payments._sum.amount || 0;
    
    // Format revenue (e.g., to "₹ 84.5M") for simple drop-in replacement
    // We'll return the raw number, and the frontend can format it or we format it here to match the mock data exactly.
    // Let's format it in frontend, but return both.
    const revenue = rawRevenue;

    // Generate Revenue Data for the last 7 months
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
    const revenueMap = new Map<string, number>();
    
    // Initialize the last 7 months with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      revenueMap.set(`${monthNames[d.getMonth()]}`, 0);
    }

    // Populate with actual data
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

    // Fetch recent activity: let's combine recent orders and applications
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
       time: act.createdAt.toLocaleDateString() // simplified time representation
     }));

    // Fetch recent orders for the table
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
}
