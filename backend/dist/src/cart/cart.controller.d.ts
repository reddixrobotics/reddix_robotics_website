import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<({
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
    addToCart(req: any, body: {
        productId: string;
        quantity: number;
    }): Promise<{
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
    updateQuantity(req: any, productId: string, body: {
        quantity: number;
    }): Promise<{
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
    removeFromCart(req: any, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearCart(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
