import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOrderDto): Promise<({
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
        customerId: string | null;
        shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
        customerId: string | null;
        shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: number;
        totalAmount: number;
        advanceAmount: number;
        remainingAmount: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
    })[]>;
    findByUser(userId: string): Promise<({
        items: ({
            product: {
                images: {
                    productId: string;
                    id: string;
                    createdAt: Date;
                    url: string;
                    isPrimary: boolean;
                }[];
            } & {
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
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
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
        shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
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
        customerId: string | null;
        shippingDetails: import("@prisma/client/runtime/client").JsonValue | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: number;
        totalAmount: number;
        advanceAmount: number;
        remainingAmount: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
    }>;
}
