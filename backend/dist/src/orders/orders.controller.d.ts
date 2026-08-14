import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly auditLogService;
    constructor(ordersService: OrdersService, auditLogService: AuditLogService);
    findAll(): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                description: string;
                price: number;
                features: string[];
                technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
                availability: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                description: string;
                price: number;
                features: string[];
                technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
                availability: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
        payments: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PaymentType;
            status: string;
            orderId: string;
            amount: number;
            transactionId: string;
            paymentMethod: string;
        }[];
    } & {
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
    }>;
    create(createOrderDto: CreateOrderDto, session: SessionData, ip: string, userAgent: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                description: string;
                price: number;
                features: string[];
                technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
                availability: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
    } & {
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
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                description: string;
                price: number;
                features: string[];
                technicalSpecifications: import("@prisma/client/runtime/client").JsonValue | null;
                availability: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
        } | null;
    } & {
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
    }>;
}
