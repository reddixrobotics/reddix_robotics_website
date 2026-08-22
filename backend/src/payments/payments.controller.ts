import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(UserAuthGuard)
  async createOrder(@Req() req: RequestWithUser, @Body('orderId') orderId: string) {
    return this.paymentsService.createRazorpayOrder(orderId, req.user.id);
  }

  @Post('verify')
  @UseGuards(UserAuthGuard)
  async verifyPayment(
    @Body('razorpay_order_id') razorpayOrderId: string,
    @Body('razorpay_payment_id') razorpayPaymentId: string,
    @Body('razorpay_signature') signature: string,
  ) {
    return this.paymentsService.verifyPayment(razorpayOrderId, razorpayPaymentId, signature);
  }
}
