import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOrderDto): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            name: string;
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
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
    }) | null>;
    findAll(): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            name: string;
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            name: string;
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
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
    updateStatus(id: string, status: OrderStatus): Promise<{
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
            name: string;
            id: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
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
