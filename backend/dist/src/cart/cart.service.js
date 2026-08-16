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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        try {
            return await this.prisma.cartItem.findMany({
                where: { userId },
                include: {
                    product: {
                        include: { images: true }
                    }
                },
            });
        }
        catch (error) {
            console.error("Cart error:", error);
            throw new common_1.InternalServerErrorException('Failed to retrieve cart');
        }
    }
    async addToCart(userId, productId, quantity) {
        if (!productId) {
            throw new common_1.NotFoundException('Product ID is required');
        }
        try {
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            const existingItem = await this.prisma.cartItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (existingItem) {
                const updatedItem = await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity },
                    include: {
                        product: {
                            include: { images: true }
                        }
                    },
                });
                return {
                    success: true,
                    message: 'Cart item updated',
                    cartItem: updatedItem,
                };
            }
            const cartItem = await this.prisma.cartItem.create({
                data: {
                    userId,
                    productId,
                    quantity,
                },
                include: {
                    product: {
                        include: { images: true }
                    }
                },
            });
            return {
                success: true,
                message: 'Product added to cart',
                cartItem,
            };
        }
        catch (error) {
            console.error("Cart error:", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An unexpected error occurred while adding to cart');
        }
    }
    async updateQuantity(userId, productId, quantity) {
        if (!productId) {
            throw new common_1.NotFoundException('Product ID is required');
        }
        if (quantity <= 0) {
            return this.removeFromCart(userId, productId);
        }
        try {
            const existingItem = await this.prisma.cartItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (!existingItem) {
                throw new common_1.NotFoundException('Cart item not found');
            }
            const updatedItem = await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity },
                include: {
                    product: {
                        include: { images: true }
                    }
                },
            });
            return {
                success: true,
                message: 'Cart item updated',
                cartItem: updatedItem,
            };
        }
        catch (error) {
            console.error("Cart error:", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An unexpected error occurred while updating cart');
        }
    }
    async removeFromCart(userId, productId) {
        if (!productId) {
            throw new common_1.NotFoundException('Product ID is required');
        }
        try {
            const existingItem = await this.prisma.cartItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (existingItem) {
                await this.prisma.cartItem.delete({
                    where: { id: existingItem.id },
                });
            }
            return { success: true, message: 'Product removed from cart' };
        }
        catch (error) {
            console.error("Cart error:", error);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while removing from cart');
        }
    }
    async clearCart(userId) {
        try {
            await this.prisma.cartItem.deleteMany({
                where: { userId },
            });
            return { success: true, message: 'Cart cleared' };
        }
        catch (error) {
            console.error("Cart error:", error);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while clearing cart');
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map