import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register a new payment and update order payment status accordingly.
   */
  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
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

      // If payment was successful, update the Order's paymentStatus
      if (dto.status.toUpperCase() === 'SUCCESS') {
        let orderPaymentStatus: PaymentStatus = order.paymentStatus;
        if (dto.type === 'ADVANCE') {
          orderPaymentStatus = PaymentStatus.PARTIALLY_PAID;
        } else if (dto.type === 'BALANCE') {
          orderPaymentStatus = PaymentStatus.FULLY_PAID;
        }

        await tx.order.update({
          where: { id: dto.orderId },
          data: { paymentStatus: orderPaymentStatus },
        });
      }

      return payment;
    });
  }

  /**
   * List all payments.
   */
  async findAll() {
    return this.prisma.payment.findMany({
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single payment.
   */
  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment record ${id} not found`);
    }

    return payment;
  }
}
