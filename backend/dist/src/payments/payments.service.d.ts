import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        status: string;
        orderId: string;
        amount: number;
        transactionId: string;
        paymentMethod: string;
    }>;
    findAll(): Promise<({
        order: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            subtotal: number;
            totalAmount: number;
            advanceAmount: number;
            remainingAmount: number;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        status: string;
        orderId: string;
        amount: number;
        transactionId: string;
        paymentMethod: string;
    })[]>;
    findOne(id: string): Promise<{
        order: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            subtotal: number;
            totalAmount: number;
            advanceAmount: number;
            remainingAmount: number;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        status: string;
        orderId: string;
        amount: number;
        transactionId: string;
        paymentMethod: string;
    }>;
}
