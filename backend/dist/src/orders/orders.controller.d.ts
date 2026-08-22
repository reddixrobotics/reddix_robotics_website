import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { SessionData } from '../auth/session.service';
import { AuditLogService } from '../audit/audit-log.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
export declare class OrdersController {
    private readonly ordersService;
    private readonly auditLogService;
    constructor(ordersService: OrdersService, auditLogService: AuditLogService);
    findAll(): Promise<({
        shipment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            courier: string;
            awbNumber: string | null;
            trackingUrl: string | null;
        } | null;
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
    })[]>;
    findOne(id: string): Promise<{
        shipment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            courier: string;
            awbNumber: string | null;
            trackingUrl: string | null;
        } | null;
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
            currency: string;
            transactionId: string | null;
            razorpayOrderId: string | null;
            razorpayPaymentId: string | null;
            paymentMethod: string;
        }[];
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
    }>;
    create(createOrderDto: CreateOrderDto, session: SessionData, ip: string, userAgent: string): Promise<{
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
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, session: SessionData, ip: string, userAgent: string): Promise<{
        shipment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            courier: string;
            awbNumber: string | null;
            trackingUrl: string | null;
        } | null;
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
    }>;
    createShipment(id: string, body: {
        courier?: string;
    }, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ShipmentStatus;
        orderId: string;
        courier: string;
        awbNumber: string | null;
        trackingUrl: string | null;
    }>;
    updateShipment(id: string, body: UpdateShipmentDto, session: SessionData, ip: string, userAgent: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ShipmentStatus;
        orderId: string;
        courier: string;
        awbNumber: string | null;
        trackingUrl: string | null;
    }>;
}
