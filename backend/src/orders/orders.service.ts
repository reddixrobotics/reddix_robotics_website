import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

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

    const itemRecords: { productId: string; quantity: number; price: number }[] = [];
    let subtotal = 0;

    // Retrieve database prices and calculate subtotal
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
      subtotal += itemPrice * item.quantity;

      itemRecords.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Server-side calculated values
    const totalAmount = subtotal;
    const advanceAmount = totalAmount * 0.5;
    const remainingAmount = totalAmount * 0.5;

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
      },
    });
  }
}
