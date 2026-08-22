import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService
  ) {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } else {
      console.warn('Razorpay credentials not found in environment variables.');
    }
  }

  async createRazorpayOrder(orderId: string, userId: string) {
    if (!this.razorpay) {
      throw new BadRequestException('Razorpay is not configured on the server.');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === 'FULLY_PAID') {
      throw new BadRequestException('Order is already fully paid');
    }

    // Get the exact advance amount securely calculated by our own backend
    let amountInCents = Math.round(order.advanceAmount * 100);

    // Enforce Razorpay's minimum amount allowed (e.g., 50 cents / $0.50)
    // If the calculated deposit is less than the minimum, bump it up to the minimum to avoid API rejection
    if (amountInCents < 50) {
      amountInCents = 50;
    }

    // Enforce Razorpay's maximum amount allowed for Test Mode (usually $5,000 / 500,000 cents)
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

      // Create a pending Payment record in our DB
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.advanceAmount,
          currency: 'USD',
          razorpayOrderId: razorpayOrder.id,
          status: 'PENDING',
          type: 'ADVANCE', // Map to Prisma enum PaymentType
          paymentMethod: 'Razorpay',
        },
      });

      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      const errorMsg = error?.error?.description || error?.message || 'Unknown Razorpay error';
      throw new BadRequestException(`Failed to create payment order: ${errorMsg}`);
    }
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new BadRequestException('Razorpay secret not configured');
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Signature is valid, update our database
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === 'SUCCESS') {
      return { success: true, message: 'Already verified' };
    }

    // Update payment and order in a transaction
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

  async findOneAdmin(id: string) {
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
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }
}
