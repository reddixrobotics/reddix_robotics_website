"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        try {
            return await this.prisma.wishlistItem.findMany({
                where: { userId },
                include: {
                    product: {
                        include: { images: true }
                    }
                },
            });
        }
        catch (error) {
            console.error("Wishlist error:", error);
            throw new common_1.InternalServerErrorException('Failed to retrieve wishlist');
        }
    }
    async addToWishlist(userId, productId) {
        if (!productId) {
            throw new common_1.NotFoundException('Product ID is required');
        }
        try {
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            const existingItem = await this.prisma.wishlistItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (existingItem) {
                return {
                    success: true,
                    message: 'Product already exists in wishlist',
                    wishlistItem: existingItem,
                };
            }
            const wishlistItem = await this.prisma.wishlistItem.create({
                data: {
                    userId,
                    productId,
                },
                include: {
                    product: {
                        include: { images: true }
                    }
                },
            });
            return {
                success: true,
                message: 'Product added to wishlist',
                wishlistItem,
            };
        }
        catch (error) {
            console.error("Wishlist error:", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An unexpected error occurred while adding to wishlist');
        }
    }
    async removeFromWishlist(userId, productId) {
        if (!productId) {
            throw new common_1.NotFoundException('Product ID is required');
        }
        try {
            const existingItem = await this.prisma.wishlistItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (existingItem) {
                await this.prisma.wishlistItem.delete({
                    where: { id: existingItem.id },
                });
            }
            return { success: true, message: 'Product removed from wishlist' };
        }
        catch (error) {
            console.error("Wishlist error:", error);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while removing from wishlist');
        }
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map