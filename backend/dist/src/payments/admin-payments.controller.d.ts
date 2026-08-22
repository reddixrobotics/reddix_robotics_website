import { PaymentsService } from './payments.service';
export declare class AdminPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(): Promise<({
        order: {
            items: {
                productId: string;
                id: string;
                price: number;
                createdAt: Date;
                quantity: number;
                orderId: string;
            }[];
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                phone: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
            customerId: string | null;
            shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
        currency: string;
        transactionId: string | null;
        razorpayOrderId: string | null;
        razorpayPaymentId: string | null;
        paymentMethod: string;
    })[]>;
    findOne(id: string): Promise<{
        order: {
            items: ({
                product: {
                    id: string;
                    name: string;
                    category: string;
                    description: string;
                    price: number;
                    depositPercentage: number;
                    stock: number;
                    features: string[];
                    technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
                    availability: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                productId: string;
                id: string;
                price: number;
                createdAt: Date;
                quantity: number;
                orderId: string;
            })[];
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.UserRole;
                phone: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
            customerId: string | null;
            shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
        currency: string;
        transactionId: string | null;
        razorpayOrderId: string | null;
        razorpayPaymentId: string | null;
        paymentMethod: string;
    }>;
}
