import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly auditLogService;
    constructor(paymentsService: PaymentsService, auditLogService: AuditLogService);
    findAll(): Promise<({
        order: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string | null;
            shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
            shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
    create(createPaymentDto: CreatePaymentDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
