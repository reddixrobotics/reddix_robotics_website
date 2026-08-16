import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: any): Promise<({
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
    addToWishlist(req: any, body: {
        productId: string;
    }): Promise<{
        success: boolean;
        message: string;
        wishlistItem: {
            productId: string;
            id: string;
            createdAt: Date;
            userId: string;
        };
    }>;
    removeFromWishlist(req: any, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
