import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { PaymentType } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  status: string; // e.g. SUCCESS, FAILED, PENDING

  @IsEnum(PaymentType)
  type: PaymentType; // ADVANCE or BALANCE

  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // e.g. STRIPE, BANK_TRANSFER, cash
}
