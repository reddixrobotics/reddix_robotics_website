import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class UserOrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getMyOrders(req: RequestWithUser): Promise<({
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
    createMyOrder(req: RequestWithUser, createOrderDto: CreateOrderDto): Promise<{
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
}
export {};
