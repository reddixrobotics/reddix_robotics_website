import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<({
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
        userId: string;
    })[]>;
    addToWishlist(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
        wishlistItem: {
            productId: string;
            id: string;
            createdAt: Date;
            userId: string;
        };
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
