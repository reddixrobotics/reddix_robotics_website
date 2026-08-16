import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<({
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
    })[]>;
    addToCart(userId: string, productId: string, quantity: number): Promise<{
        success: boolean;
        message: string;
        cartItem: {
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            quantity: number;
        };
    }>;
    updateQuantity(userId: string, productId: string, quantity: number): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message: string;
        cartItem: {
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            quantity: number;
        };
    }>;
    removeFromCart(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
