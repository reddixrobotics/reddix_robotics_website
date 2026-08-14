import { PaymentType } from '@prisma/client';
export declare class CreatePaymentDto {
    orderId: string;
    amount: number;
    transactionId: string;
    status: string;
    type: PaymentType;
    paymentMethod: string;
}
