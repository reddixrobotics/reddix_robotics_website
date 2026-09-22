import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, ShipmentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an order with strict server-side price calculation.
   */
  async create(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const itemRecords: { productId: string; quantity: number; price: number; depositAmount: number }[] = [];
    let subtotal = 0;
    let advanceAmount = 0;

    // Retrieve database prices and calculate subtotal and deposit
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (!product.availability) {
        throw new BadRequestException(`Product ${product.name} is currently unavailable`);
      }

      const itemPrice = product.price;
      const depositPercentage = product.depositPercentage ?? 50; // Fallback to 50 if missing
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

    // Server-side calculated values
    const totalAmount = subtotal;
    const remainingAmount = totalAmount - advanceAmount;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return this.prisma.$transaction(async (tx) => {
      // Create the main Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: dto.customerId || null,
          subtotal,
          totalAmount,
          advanceAmount,
          remainingAmount,
          status: OrderStatus.ORDER_PLACED,
          paymentStatus: 'PENDING',
          shippingDetails: dto.shippingDetails || null,
        },
      });

      // Create E-commerce Order Items
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

  /**
   * Find all orders.
   */
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

  /**
   * Find orders for a specific user
   */
  async findByUser(userId: string) {
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

  /**
   * Find a single order by ID.
   */
  async findOne(id: string) {
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Update E-commerce Order Status.
   */
  async updateStatus(id: string, status: OrderStatus) {
    // Check if order exists
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

  /**
   * Manually create a shipment record for an order
   */
  async createShipment(orderId: string, courier: string = 'DELHIVERY') {
    const order = await this.findOne(orderId);
    
    if (order.shipment) {
      throw new BadRequestException('Shipment already exists for this order');
    }

    return this.prisma.shipment.create({
      data: {
        orderId,
        courier,
        status: ShipmentStatus.CREATED,
      },
    });
  }

  /**
   * Update a manual shipment with tracking info
   */
  async updateShipment(orderId: string, data: { awbNumber?: string; trackingUrl?: string; status?: ShipmentStatus }) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { orderId },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found for this order. Create it first.');
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
}
